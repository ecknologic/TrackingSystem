var express = require('express');
var router = express.Router();
const invoiceQueries = require('../../dbQueries/invoice/queries.js');
const { dbError, base64String, formatDate } = require('../../utils/functions.js');
const { UPDATEMESSAGE, DATEFORMAT } = require('../../utils/constants');
const customerQueries = require('../../dbQueries/Customer/queries.js');
const { createSingleDeliveryInvoice } = require('./createInvoice.js');
const { createMultiDeliveryInvoice } = require('./invoice.js');
const fs = require('fs');
const { generatePDF, generateCustomerPDF } = require('../../dbQueries/Customer/queries.js');
const dayjs = require('dayjs');
const { sendMail } = require('../mailTemplate.js');
var departmentId;

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    departmentId = req.headers['departmentid']
    next();
});

router.get('/getInvoices', (req, res) => {
    invoiceQueries.getInvoices(req.params.status, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getInvoicesByRole/:roleId', (req, res) => {
    invoiceQueries.getInvoicesByRole(req.params.roleId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getCustomerInvoices/:customerId', (req, res) => {
    invoiceQueries.getCustomerInvoices(req.params.customerId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getInvoices/:status', (req, res) => {
    invoiceQueries.getInvoiceByStatus(req.params.status, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getDepartmentInvoices', (req, res) => {
    invoiceQueries.getInvoiceByDepartment(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getInvoiceById/:invoiceId', (req, res) => {
    const { invoiceId } = req.params
    getInvoiceByInvoiceId({ invoiceId, departmentInvoice: false, res })
});

router.get('/getDepartmentInvoiceById/:invoiceId', (req, res) => {
    const { invoiceId } = req.params
    getInvoiceByInvoiceId({ invoiceId, departmentInvoice: true, res })
});

router.get('/getInvoiceId', (req, res) => {
    invoiceQueries.getInvoiceId(req.query.departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(getInvoiceNumber(results[0].invoiceId + 1));
    });
});
router.get('/getTotalInvoicesCount', (req, res) => {
    invoiceQueries.getInvoicesCount(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let pendingCount = 0, paidCount = 0
            results.map(item => {
                if (item.status == "Pending") pendingCount = item.totalCount
                if (item.status == "Paid") paidCount = item.totalCount
            })
            invoiceQueries.getDepartmentInvoicesCount(req.query, (err, depInvoices) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    depInvoices.map(item => {
                        if (item.status == "Pending"||item.status == "Inprogress") pendingCount = pendingCount + item.totalCount
                        if (item.status == "Paid") paidCount = paidCount + item.totalCount
                    })
                    res.json({ paidCount, pendingCount, totalCount: paidCount + pendingCount })
                }
            })
        }
    });
});
router.put('/deleteInvoiceProducts', (req, res) => {
    invoiceQueries.deleteInvoiceProducts(req.body.deleted, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send("Deleted successfully");
    });
});

router.put('/updateInvoiceStatus', (req, res) => {
    invoiceQueries.updateInvoiceStatus(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send("Updated successfully");
    });
});

router.put('/updateDepartmentInvoiceStatus', (req, res) => {
    invoiceQueries.updateDepartmentInvoiceStatus(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send("Updated successfully");
    });
});

router.post("/generateMultipleInvoices", (req, res) => {
    invoiceQueries.getInvoiceId(req.query.departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            generatePDF(req.body, async (err, data) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    if (!data.length) res.status(400).json('No data found')
                    else {
                        let customersArr = []
                        data.map(item => {
                            let index = customersArr.findIndex(customer => item.customerId == customer.customerId)
                            if (index >= 0) {
                                let products = addProducts(JSON.parse(item.products))
                                customersArr[index].products = customersArr[index].products.concat(products)
                            } else {
                                let products = addProducts(JSON.parse(item.products))
                                customersArr.push({ ...item, products })
                            }
                        })
                        let arr = []
                        const { fromDate, toDate } = req.body
                        for (let [index, i] of customersArr.entries()) {
                            let { gstNo, products, customerId, creditPeriodInDays, organizationName, EmailId, createdBy } = i
                            let finalProducts = [];
                            let obj = {
                                customerName: organizationName,
                                gstNo,
                                invoiceDate: formatDate(new Date()),
                                customerId: customerId,
                                salesPerson: createdBy,
                                dueDate: creditPeriodInDays ? dayjs().add(creditPeriodInDays, 'day').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                                hsnCode: 22011010,
                                poNo: 0,
                                mailSubject: "Hello",
                                TAndC: "hi",
                                fromDate,
                                toDate,
                                invoiceId: getInvoiceNumber(results[0].invoiceId + (index + 1)),
                                mailIds: EmailId
                            }
                            products.map(product => {
                                const { location: address, deliveryAddress, price20L, price2L, price1L, price500ML, price300ML } = product
                                let addedProducts = []
                                if (product['20LCans'] > 0) {
                                    if (!addedProducts.includes("20LCans")) {
                                        finalProducts.push({
                                            "productName": "20 Lt Bibo Water Jar",
                                            "quantity": product['20LCans'],
                                            "productPrice": price20L,
                                            "discount": 0,
                                            "tax": 12,
                                            address,
                                            deliveryAddress,
                                            ...getResults({ gstNo, quantity: product['20LCans'], productPrice: price20L, discount: 0, tax: 12 })
                                        })
                                        addedProducts.push("20LCans")
                                    }
                                }
                                if (product['1LBoxes'] > 0) {
                                    if (!addedProducts.includes("1LBoxes")) {
                                        finalProducts.push({
                                            "productName": "1 Lt Bibo Water Jar",
                                            "quantity": product['1LBoxes'],
                                            "productPrice": price1L,
                                            "discount": 0,
                                            "tax": 18,
                                            address,
                                            deliveryAddress,
                                            ...getResults({ gstNo, quantity: product['1LBoxes'], productPrice: price1L, discount: 0, tax: 18 })

                                        })
                                        addedProducts.push("1LBoxes")
                                    }
                                }
                                if (product['500MLBoxes'] > 0) {
                                    if (!addedProducts.includes("500MLBoxes")) {
                                        finalProducts.push({
                                            "productName": "500ML Bibo Water Jar",
                                            "quantity": product['500MLBoxes'],
                                            "productPrice": price500ML,
                                            "discount": 0,
                                            "tax": 18,
                                            address,
                                            deliveryAddress,
                                            ...getResults({ gstNo, quantity: product['500MLBoxes'], productPrice: price500ML, discount: 0, tax: 18 })

                                        })
                                        addedProducts.push("500MLBoxes")
                                    }
                                }
                                if (product['300MLBoxes'] > 0) {
                                    if (!addedProducts.includes("300MLBoxes")) {
                                        finalProducts.push({
                                            "productName": "300ML Lt Bibo Water Jar",
                                            "quantity": product['300MLBoxes'],
                                            "productPrice": price300ML,
                                            "discount": 0,
                                            "tax": 18,
                                            address,
                                            deliveryAddress,
                                            ...getResults({ gstNo, quantity: product['300MLBoxes'], productPrice: price300ML, discount: 0, tax: 18 })
                                        })
                                        addedProducts.push("300MLBoxes")
                                    }
                                }
                                if (product['2LBoxes'] > 0) {
                                    if (!addedProducts.includes("2LBoxes")) {
                                        finalProducts.push({
                                            "productName": "2 Lt Bibo Water Jar",
                                            "quantity": product['2LBoxes'],
                                            "productPrice": price2L,
                                            "discount": 0,
                                            "tax": 18,
                                            address,
                                            deliveryAddress,
                                            ...getResults({ gstNo, quantity: product['2LBoxes'], productPrice: price2L, discount: 0, tax: 18 })
                                        })
                                        addedProducts.push("2LBoxes")
                                    }
                                }
                            })

                            obj.products = finalProducts
                            obj.totalAmount = computeTotalAmount(finalProducts)
                            await saveInvoice(obj, res, index == (customersArr.length - 1) ? true : false)
                            arr.push(obj)
                        }
                    }
                }
            })
        }
    })
});

router.post("/createDepartmentInvoice", (req, res) => {
    req.body.departmentId = departmentId
    invoiceQueries.getDepartmentInvoiceByDCNO(req.body.dcNo, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (results.length) res.status(400).json({ message: "Invoice already created with this DC number" })
        else saveDepartmentInvoice(req.body, res, true)
    })
});

router.post("/createInvoice", (req, res) => {
    // let { customerId, customerName, organizationName, address, gstNo, panNo, mobileNumber, products } = req.body
    // let obj = {
    //     customerId, customerName, organizationName, address, gstNo, panNo, mobileNumber
    // }
    // if (products.length) {
    //     for (let i of products) {
    //         if (i.productName.startsWith('20')) {
    //             obj['20LCans'] = i.quantity
    //             obj['price20L'] = i.productPrice
    //         } else if (i.productName.startsWith('1')) {
    //             obj['1LBoxes'] = i.quantity
    //             obj['price1L'] = i.productPrice
    //         } else if (i.productName.startsWith('500')) {
    //             obj['500MLBoxes'] = i.quantity
    //             obj['price500ML'] = i.productPrice
    //         } else if (i.productName.startsWith('300')) {
    //             obj['300MLBoxes'] = i.quantity
    //             obj['price300ML'] = i.productPrice
    //         }
    //         else if (i.productName.startsWith('2')) {
    //             obj['2LBoxes'] = i.quantity
    //             obj['price2L'] = i.productPrice
    //         }
    //     }
    // }
    // // let invoice = {
    // //     items: [obj], invoiceId, gstNo
    // // }
    // // createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
    // // })
    // saveInvoice(req.body, res, true)
    let { customerId, customerName, invoiceId, fromDate, toDate, organizationName, address, gstNo, panNo, mobileNumber } = req.body

    generateCustomerPDF({ fromDate, toDate, customerId }, (err, data) => {
        if (err) res.status(500).json(dbError(err));
        else if (data.length) {
            if (!JSON.parse(data[0].products)) {
                res.status(400).json("No products found")
            } else {
                let products = addProducts(JSON.parse(data[0].products))
                let product = products[0]
                const { EmailId } = data[0]
                const {
                    location: address,
                    deliveryAddress,
                    price1L,
                    price2L,
                    price20L,
                    price300ML,
                    price500ML
                } = product
                let arr = []
                if (product['20LCans'] > 0) {
                    arr.push(prepareProductObj({ deliveryAddress, invoiceId, productName: "20 Lt Bibo Water Jar", quantity: product['20LCans'], productPrice: price20L, tax: 12, gstNo, address }))
                }
                if (product['2LBoxes'] > 0) {
                    arr.push(prepareProductObj({ deliveryAddress, invoiceId, productName: "2 Lt Bibo Water Bottle Case - 9 bottles", quantity: product['2LBoxes'], productPrice: price2L, tax: 18, gstNo, address }))
                }
                if (product['1LBoxes'] > 0) {
                    arr.push(prepareProductObj({ deliveryAddress, invoiceId, productName: "1Lt Bibo Water Case - 12 Bottles", quantity: product['1LBoxes'], productPrice: price1L, tax: 18, gstNo, address }))
                }
                if (product['500MLBoxes'] > 0) {
                    arr.push(prepareProductObj({ deliveryAddress, invoiceId, productName: "500 ML Bibo Water Cases - 24 Bottles", quantity: product['500MLBoxes'], productPrice: price500ML, tax: 18, gstNo, address }))
                }
                if (product['300MLBoxes'] > 0) {
                    arr.push(prepareProductObj({ deliveryAddress, invoiceId, productName: "300 ML Bibo Water Cases - 30 Bottles", quantity: product['300MLBoxes'], productPrice: price300ML, tax: 18, gstNo, address }))
                }
                const { totalAmount } = computeFinalAmounts(arr)
                req.body.products = arr
                req.body.mailIds = EmailId
                req.body.totalAmount = totalAmount
                saveInvoice(req.body, res, true)
            }
        }
        else res.status(404).json(`No Products Delivered to ${organizationName || customerName}`)
    })

});
router.post("/updateInvoice", (req, res) => {
    let { customerId, invoiceId, customerName, organizationName, address, gstNo, panNo, mobileNumber, products } = req.body
    let obj = {
        customerId, customerName, organizationName, address, gstNo, panNo, mobileNumber
    }
    if (products.length) {
        for (let i of products) {
            if (i.productName.includes('20')) {
                obj['20LCans'] = i.quantity
                obj['price20L'] = i.productPrice
            } else if (i.productName.includes('1L')) {
                obj['1LBoxes'] = i.quantity
                obj['price1L'] = i.productPrice
            } else if (i.productName.includes('500')) {
                obj['500MLBoxes'] = i.quantity
                obj['price500ML'] = i.productPrice
            } else if (i.productName.includes('300')) {
                obj['300MLBoxes'] = i.quantity
                obj['price300ML'] = i.productPrice
            }
            else if (i.productName.includes('2 L')) {
                obj['2LBoxes'] = i.quantity
                obj['price2L'] = i.productPrice
            }
        }
    }
    // let invoice = {
    //     items: [obj], invoiceId, gstNo
    // }
    // createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
    updateInvoice(req, res)
    // })
});
const saveInvoice = async (requestObj, res, response) => {
    // req.body.invoicePdf = pdfData.toString('base64')
    invoiceQueries.createInvoice(requestObj, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products, invoiceId } = requestObj;
            if (products.length) {
                invoiceQueries.saveInvoiceProducts({ products, invoiceId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else {
                        response && res.json({ message: 'Invoice created successfully' })
                        getInvoiceByInvoiceId({ invoiceId })
                        // invoiceQueries.saveInvoicePdf({ invoiceId }, (err, data) => {
                        //     if (err) res.status(500).json(dbError(err));
                        //     else res.json({ message: 'Invoice created successfully' })
                        // })
                    }
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
const saveDepartmentInvoice = async (requestObj, res, response) => {
    // req.body.invoicePdf = pdfData.toString('base64')
    invoiceQueries.createDepartmentInvoice(requestObj, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products, invoiceId } = requestObj;
            if (products.length) {
                invoiceQueries.saveDepartmentInvoiceProducts({ products, invoiceId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else {
                        getInvoiceByInvoiceId({ invoiceId, departmentId })
                        response && res.json({ message: 'Invoice created successfully' })
                    }
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
const updateInvoice = (req, res) => {
    // req.body.invoicePdf = pdfData.toString('base64')
    invoiceQueries.updateInvoice(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products, invoiceId } = req.body;
            if (products.length) {
                invoiceQueries.updateInvoiceProducts({ products, invoiceId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else {
                        // invoiceQueries.saveInvoicePdf({ invoiceId }, (err, data) => {
                        //     if (err) res.status(500).json(dbError(err));
                        // else
                        res.json({ message: 'Invoice updated successfully' })
                        // })
                    }
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
const getResults = (row) => {
    let { quantity, productPrice, discount = 0, tax, cgst, sgst, igst, gstNo } = row
    const isLocal = gstNo && gstNo.startsWith('36')
    const priceAfterDiscount = productPrice - (productPrice / 100 * discount)
    const amount = Number((priceAfterDiscount * quantity).toFixed(2))
    const totalTax = (amount / 100 * tax)
    cgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    sgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    igst = isLocal ? 0.00 : Number((totalTax).toFixed(2))
    return { amount, cgst, sgst, igst }
}
const computeTotalAmount = (data) => {
    let amount = 0, cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
    data.map((item) => {
        amount = Number((amount + Number(item.amount)).toFixed(2))
        cgstAmount = Number((cgstAmount + item.cgst).toFixed(2))
        sgstAmount = Number((sgstAmount + item.sgst).toFixed(2))
        igstAmount = Number((igstAmount + item.igst).toFixed(2))
    })
    const totalAmount = Number((amount + cgstAmount + sgstAmount + igstAmount).toFixed(2))

    return totalAmount
}

const getInvoiceNumber = (number) => {
    if (number < 10) return `INV00${number}`
    else if (number < 100) return `INV0${number}`
    else return `INV${number}`
}
const addProducts = (products) => {
    const newData = products[0]

    products.map((item, index) => {
        if (index >= 1) {
            newData["1LBoxes"] += item["1LBoxes"]
            newData["20LCans"] += item["20LCans"]
            newData["2LBoxes"] += item["2LBoxes"]
            newData["300MLBoxes"] += item["300MLBoxes"]
            newData["500MLBoxes"] += item["500MLBoxes"]
            newData["price1L"] += item["price1L"]
            newData["price2L"] += item["price2L"]
            newData["price20L"] += item["price20L"]
            newData["price300ML"] += item["price300ML"]
            newData["price500ML"] += item["price500ML"]
            newData["address"] = item["address"]
            newData["deliveryAddress"] = item["deliveryAddress"]
        }
    })
    return [newData]
}
const prepareProductObj = (product) => {
    const { invoiceId, productName, quantity, productPrice, tax = 18, gstNo, address, deliveryAddress } = product
    let cgstValue = tax / 2
    const { amount, cgst, sgst, igst } = getResults({
        quantity, productPrice, gstNo, tax, cgst: cgstValue, sgst: cgstValue, igst: 0
    })
    return {
        productName,
        quantity,
        productPrice,
        tax,
        amount,
        cgst,
        sgst,
        igst,
        address,
        invoiceId,
        deliveryAddress,
        discount: 0
    }
}
const computeFinalAmounts = (data) => {
    let subTotal = 0, cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
    data.map((item) => {
        subTotal = Number((subTotal + Number(item.amount)).toFixed(2))
        cgstAmount = Number((cgstAmount + item.cgst).toFixed(2))
        sgstAmount = Number((sgstAmount + item.sgst).toFixed(2))
        igstAmount = Number((igstAmount + item.igst).toFixed(2))
    })
    const totalAmount = Math.round((subTotal + cgstAmount + sgstAmount + igstAmount))

    return { subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount }
}
const getInvoiceByInvoiceId = ({ invoiceId, departmentInvoice, res }) => {
    invoiceQueries.getInvoiceById({ invoiceId, departmentInvoice }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            const { gstNo, mailIds, invoiceId, Address1, deliveryAddress, customerType, fromDate, toDate, ...rest } = results[0]
            let haveMultipleAddress = false
            let products = JSON.parse(results[0].products)
            let obj = {
                gstNo, invoiceId, ...rest
            }
            obj.products = products
            if (products && products.length) {
                const uniqueValues = new Set(products.map(p => p.productName));
                if (uniqueValues.size < products.length) {
                    haveMultipleAddress = true
                }

                if (haveMultipleAddress) {
                    let arr = []
                    for (let [index, i] of products.entries()) {
                        i = {
                            gstNo, invoiceId, ...rest, ...i,
                        }
                        if (i.productName.startsWith('20')) {
                            i['20LCans'] = i.quantity
                            i['price20L'] = i.productPrice
                        } else if (i.productName.startsWith('1')) {
                            i['1LBoxes'] = i.quantity
                            i['price1L'] = i.productPrice
                        } else if (i.productName.startsWith('500')) {
                            i['500MLBoxes'] = i.quantity
                            i['price500ML'] = i.productPrice
                        } else if (i.productName.startsWith('300')) {
                            i['300MLBoxes'] = i.quantity
                            i['price300ML'] = i.productPrice
                        }
                        else if (i.productName.startsWith('2')) {
                            i['2LBoxes'] = i.quantity
                            i['price2L'] = i.productPrice
                        }
                        arr.push(i)
                        if (obj.products.length == index + 1) obj.products = arr
                    }
                } else {
                    for (let i of obj.products) {
                        obj.deliveryAddress = i.deliveryAddress
                        if (i.productName.startsWith('20')) {
                            obj['20LCans'] = i.quantity
                            obj['price20L'] = i.productPrice
                        } else if (i.productName.startsWith('1')) {
                            obj['1LBoxes'] = i.quantity
                            obj['price1L'] = i.productPrice
                        } else if (i.productName.startsWith('500')) {
                            obj['500MLBoxes'] = i.quantity
                            obj['price500ML'] = i.productPrice
                        } else if (i.productName.startsWith('300')) {
                            obj['300MLBoxes'] = i.quantity
                            obj['price300ML'] = i.productPrice
                        }
                        else if (i.productName.startsWith('2')) {
                            obj['2LBoxes'] = i.quantity
                            obj['price2L'] = i.productPrice
                        }
                    }
                }
            } else return res.status(500).json("Something went wrong")

            if (haveMultipleAddress) {
                let invoice = {
                    items: obj.products, Address1, invoiceId, gstNo, fromDate, toDate
                }
                createMultiDeliveryInvoice(invoice, `${invoiceId}.pdf`).then(response => {
                    setTimeout(() => {
                        fs.readFile(`${invoiceId}.pdf`, (err, result) => {
                            obj.invoicePdf = result
                            if (res) res.json(obj)
                            else sendMail({ mailId: mailIds, message: `Bibo Invoice from ${dayjs(fromDate).format(DATEFORMAT)} to ${dayjs(toDate).format(DATEFORMAT)}`, attachment: result, invoiceId })
                        })
                    }, 1500)
                })
            } else {
                let invoice = {
                    items: [obj], invoiceId, gstNo, Address1, fromDate, toDate
                }
                createSingleDeliveryInvoice(invoice, `${invoiceId}.pdf`).then(response => {
                    setTimeout(() => {
                        fs.readFile(`${invoiceId}.pdf`, (err, result) => {
                            obj.invoicePdf = result
                            if (res) res.json(obj)
                            else sendMail({ mailId: mailIds, message: `Bibo Invoice from ${dayjs(fromDate).format(DATEFORMAT)} to ${dayjs(toDate).format(DATEFORMAT)}`, attachment: result, invoiceId })
                        })
                    }, 1500)
                })
            }
        };
    });
}
module.exports = router;
