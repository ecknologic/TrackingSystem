var express = require('express');
var router = express.Router();
const invoiceQueries = require('../../dbQueries/invoice/queries.js');
const { dbError } = require('../../utils/functions.js');
const { UPDATEMESSAGE } = require('../../utils/constants');
const customerQueries = require('../../dbQueries/Customer/queries.js');
const { createSingleDeliveryInvoice } = require('./createInvoice.js');
const { createMultiDeliveryInvoice } = require('./invoice.js');
const fs = require('fs')

router.get('/getInvoices', (req, res) => {
    invoiceQueries.getInvoices((err, results) => {
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
router.post("/createInvoice", (req, res) => {
    customerQueries.generatePDF(req.body, (err, items) => {
        if (err) res.status(500).json(dbError(err))
        else {
            let invoice = {
                items
            }
            if (items.length > 1) {
                createMultiDeliveryInvoice(invoice, "invoice.pdf").then(response => {
                    fs.readFile("invoice.pdf", (err, result) => {
                        if (err) console.log("ERR", err)
                        else {
                            saveInvoice(req, res, result)
                        }
                    })
                })
            }
            else {
                createSingleDeliveryInvoice(invoice, "invoice.pdf").then(response => {
                    fs.readFile("invoice.pdf", (err, result) => {
                        if (err) console.log("ERR", err)
                        else {
                            saveInvoice(req, res, result)
                        }
                    })
                })
            }
        }
    })

});
const saveInvoice = (req, res, pdfData) => {
    req.body.invoicePdf = pdfData
    invoiceQueries.createInvoice(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            let { products } = req.body;
            if (products.length) {
                invoiceQueries.saveInvoiceProducts({ products, invoiceId: results.insertId }, (err, data) => {
                    if (err) res.status(500).json(dbError(err));
                    else res.json(data)
                })
            } else res.status(500).json({ message: "Products should not be empty" })
        }
    })
}
module.exports = router;
