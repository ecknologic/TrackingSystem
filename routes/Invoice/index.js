var express = require('express');
var router = express.Router();
const invoiceQueries = require('../../dbQueries/invoice/queries.js');
const { dbError, base64String } = require('../../utils/functions.js');
const { UPDATEMESSAGE } = require('../../utils/constants');
const customerQueries = require('../../dbQueries/Customer/queries.js');
const { createSingleDeliveryInvoice } = require('./createInvoice.js');
const { createMultiDeliveryInvoice } = require('./invoice.js');
const fs = require('fs');
const { generatePDF } = require('../../dbQueries/Customer/queries.js');
const dayjs = require('dayjs');

router.get('/getInvoices', (req, res) => {
    invoiceQueries.getInvoices(req.params.status, (err, results) => {
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
router.get('/getInvoiceById/:invoiceId', (req, res) => {
    invoiceQueries.getInvoiceById(req.params.invoiceId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            const { gstNo, invoiceId, ...rest } = results[0]
            let products = JSON.parse(results[0].products)
            let obj = {
                gstNo, invoiceId, ...rest
            }
            obj.products = products
            if (obj.products.length) {
                for (let i of obj.products) {
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
            let invoice = {
                items: [obj], invoiceId, gstNo
            }
            createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
                setTimeout(() => {
                    fs.readFile("invoice.pdf", (err, result) => {
                        obj.invoicePdf = result
                        res.json(obj)
                    })
                }, 1500)
            })
        };
    });
});

router.get('/getInvoiceId', (req, res) => {
    invoiceQueries.getInvoiceId((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(getInvoiceNumber(results[0].invoiceId + 1));
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
router.post("/generateMultipleInvoices", (req, res) => {
    invoiceQueries.getInvoiceId((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            generatePDF(req.body, async (err, data) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    if (!data.length) res.status(404).json('No data found')
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
                        for (let [index, i] of customersArr.entries()) {
                            let { gstNo, products, customerId, creditPeriodInDays, customerName, EmailId, createdBy } = i
                            let finalProducts = []
                            let obj = {
                                customerName,
                                gstNo,
                                invoiceDate: new Date(),
                                customerId: customerId,
                                salesPerson: createdBy,
                                dueDate: dayjs().add(creditPeriodInDays, 'day'),
                                hsnCode: 22011010,
                                poNo: 0,
                                mailSubject: "Hello",
                                TAndC: "hi",
                                invoiceId: getInvoiceNumber(results[0].invoiceId + (index + 1)),
                                mailIds: EmailId
                            }
                            products.map(product => {
                                const { address, price20L, price2L, price1L, price500ML, price300ML } = product
                                if (product['20LCans'] > 0) {
                                    finalProducts.push({
                                        "productName": "20 Lt Bibo Water Jar",
                                        "quantity": product['20LCans'],
                                        "productPrice": price20L,
                                        "discount": 0,
                                        "tax": 12,
                                        address,
                                        ...getResults({ gstNo, quantity: product['20LCans'], productPrice: price20L, discount: 0, tax: 12 })
                                    })
                                }
                                if (product['1LBoxes'] > 0) {
                                    finalProducts.push({
                                        "productName": "1 Lt Bibo Water Jar",
                                        "quantity": product['1LBoxes'],
                                        "productPrice": price1L,
                                        "discount": 0,
                                        "tax": 18,
                                        address,
                                        ...getResults({ gstNo, quantity: product['1LBoxes'], productPrice: price1L, discount: 0, tax: 18 })

                                    })
                                }
                                if (product['500MLBoxes'] > 0) {
                                    finalProducts.push({
                                        "productName": "500ML Bibo Water Jar",
                                        "quantity": product['500MLBoxes'],
                                        "productPrice": price500ML,
                                        "discount": 0,
                                        "tax": 18,
                                        address,
                                        ...getResults({ gstNo, quantity: product['500MLBoxes'], productPrice: price500ML, discount: 0, tax: 18 })

                                    })
                                }
                                if (product['300MLBoxes'] > 0) {
                                    finalProducts.push({
                                        "productName": "300ML Lt Bibo Water Jar",
                                        "quantity": product['300MLBoxes'],
                                        "productPrice": price300ML,
                                        "discount": 0,
                                        "tax": 18,
                                        address,
                                        ...getResults({ gstNo, quantity: product['300MLBoxes'], productPrice: price300ML, discount: 0, tax: 18 })
                                    })
                                }
                                if (product['2LBoxes'] > 0) {
                                    finalProducts.push({
                                        "productName": "2 Lt Bibo Water Jar",
                                        "quantity": product['2LBoxes'],
                                        "productPrice": price2L,
                                        "discount": 0,
                                        "tax": 18,
                                        address,
                                        ...getResults({ gstNo, quantity: product['2LBoxes'], productPrice: price2L, discount: 0, tax: 18 })
                                    })
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
router.post("/createInvoice", (req, res) => {
    let { customerId, customerName, organizationName, address, gstNo, panNo, mobileNumber, products } = req.body
    let obj = {
        customerId, customerName, organizationName, address, gstNo, panNo, mobileNumber
    }
    if (products.length) {
        for (let i of products) {
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
    // let invoice = {
    //     items: [obj], invoiceId, gstNo
    // }
    // createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
    // })
    saveInvoice(req.body, res, true)
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
        if (index >= 0) {
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
        }
    })
    return [newData]
}
module.exports = router;
