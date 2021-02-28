var express = require('express');
var router = express.Router();
const invoiceQueries = require('../../dbQueries/invoice/queries.js');
const { dbError, base64String } = require('../../utils/functions.js');
const { UPDATEMESSAGE } = require('../../utils/constants');
const customerQueries = require('../../dbQueries/Customer/queries.js');
const { createSingleDeliveryInvoice } = require('./createInvoice.js');
const { createMultiDeliveryInvoice } = require('./invoice.js');
const fs = require('fs');

router.get('/getInvoices/:status', (req, res) => {
    invoiceQueries.getInvoices(req.params.status, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});
router.get('/getInvoiceById/:invoiceId', (req, res) => {
    invoiceQueries.getInvoiceById(req.params.invoiceId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.get('/getInvoiceId', (req, res) => {
    invoiceQueries.getInvoiceId((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(`INV00${results[0].invoiceId + 1}`);
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
router.post("/createInvoice", (req, res) => {
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
    let invoice = {
        items: [obj], invoiceId
    }
    createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
        saveInvoice(req, res, result)
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
    let invoice = {
        items: [obj], invoiceId
    }
    createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
        updateInvoice(req, res, result)
    })
});
const saveInvoice = (req, res, pdfData) => {
    req.body.invoicePdf = pdfData.toString('base64')
    invoiceQueries.createInvoice(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products, invoiceId } = req.body;
            if (products.length) {
                invoiceQueries.saveInvoiceProducts({ products, invoiceId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else {
                        invoiceQueries.saveInvoicePdf({ invoiceId }, (err, data) => {
                            if (err) res.status(500).json(dbError(err));
                            else res.json({ message: 'Invoice created successfully' })
                        })
                    }
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
const updateInvoice = (req, res, pdfData) => {
    req.body.invoicePdf = pdfData.toString('base64')
    invoiceQueries.updateInvoice(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products, invoiceId } = req.body;
            if (products.length) {
                invoiceQueries.updateInvoiceProducts({ products, invoiceId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else {
                        invoiceQueries.saveInvoicePdf({ invoiceId }, (err, data) => {
                            if (err) res.status(500).json(dbError(err));
                            else res.json({ message: 'Invoice updated successfully' })
                        })
                    }
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
module.exports = router;
