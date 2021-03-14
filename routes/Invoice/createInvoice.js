const fs = require("fs");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../../utils/functions");
const HSNCODE = 22011010;
const GST20L = 12, GSTOthers = 18, CGST20L = 6, CGSTOthers = 9;
var totalTaxValue = 0
var totalCGSTValue = 0
var totalIGSTValue = 0
function createSingleDeliveryInvoice(invoice, path) {
    return new Promise((resolve) => {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        totalCGSTValue = 0
        totalTaxValue = 0
        totalIGSTValue = 0

        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        billingTable(doc, invoice);
        generateInvoiceTable(doc, invoice);
        generateFooter(doc);

        doc.end();
        doc.pipe(fs.createWriteStream(path));
        resolve({ message: 'Success' })
    })
}



function generateHeader(doc) {
    doc
        .rect(25, 20, 545, 800)
        .stroke()
        .fontSize(12)
        .text("Acer Engineers Pvt Ltd.", 30, 30, { align: "left" })
        .fontSize(8)
        .text("Plot No : 58,Amar Cooperative Society,Kavuri Hills,Hyderabad - 500 033,", 30, 50)
        .text("Contact us : 040 4853 8777/ 91 90526 17329 ,email: Info@bibowater.com", 30, 60)
        .text("GSTIN: 36AACCA3412D1ZD", 30, 70)
        .text("PAN No: AACCA3412D", 30, 80)
        .image("bibo_logo.png", 460, 50, { width: 80 })
        // .fillColor("#444444")
        .text('www.Bibowater.co', 320, 60)
        .fontSize(15)
        .fillColor("red")
        .text("TAX INVOICE", 450, 30, { color: "red" })
        .underline(455, 35, 85, 10, { color: "red" })

        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    const { invoiceId, fromDate, toDate } = invoice
    doc
        .fillColor("#444444")
    generateHr(doc, 100);

    const customerInformationTop = 110;

    doc
        .fontSize(10)
        .text("Original for receipient", 0, customerInformationTop, { align: "right" })
        .text("Duplicate for transporter", { align: "right" })
        .text("Triplicate for supplier", { align: "right" })
        .text("Invoice No:" + invoiceId, 40, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 40, customerInformationTop + 15)
        .text(formatDate(new Date()), 100, customerInformationTop + 15)
        .text("Period of supply:", 40, customerInformationTop + 30)
        .text(
            formatDate(new Date(fromDate)) + '  to  ' + formatDate(new Date(toDate)),
            115,
            customerInformationTop + 30
        )
        .moveDown();
    generateHr(doc, 160);
}

function generateInvoiceTable(doc, invoice) {
    let i, subTotal = 0;
    let invoiceTableTop = 300;

    doc.font("Helvetica-Bold");
    generateIndividualTableRow(
        doc,
        invoiceTableTop,
        "Product",
        "HSN CODE",
        "% GST",
        "Quantity",
        "Price",
        "Taxable Value",
        "CGST",
        "SGST",
        "IGST"
    )
    generateHr(doc, invoiceTableTop + 20);

    doc.font("Helvetica");

    for (i = 0, j = 0; i < invoice.items.length; i++) {
        const { items, gstNo } = invoice;
        const item = items[i];
        let product, quantity, price, address = item.address;
        let arr = [{ "20LCans": item["20LCans"], price20L: item.price20L }, { "1LBoxes": item["1LBoxes"], "price1L": item.price1L }, { "500MLBoxes": item["500MLBoxes"], "price500ML": item.price500ML }, { "300MLBoxes": item["300MLBoxes"], "price300ML": item.price300ML }, { "2LBoxes": item["2LBoxes"], "price2L": item.price2L }]
        for (let [index, productInfo] of arr.entries()) {
            if (productInfo["20LCans"] > 0) {
                product = "20 Lt Bt Jar";
                quantity = productInfo["20LCans"];
                price = productInfo.price20L
                subTotal = subTotal + productInfo.price20L
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i, gstNo)
                j++;
            }
            else if (productInfo["2LBoxes"] > 0) {
                product = "2L Boxes";
                quantity = productInfo["2LBoxes"];
                price = productInfo.price2L
                subTotal = subTotal + productInfo.price2L
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i, gstNo)
                j++;
            } else if (productInfo["1LBoxes"] > 0) {
                product = "1L Boxes";
                quantity = productInfo["1LBoxes"];
                price = productInfo.price1L
                subTotal = subTotal + productInfo.price1L
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i, gstNo)
                j++;
            } else if (productInfo["500MLBoxes"] > 0) {
                product = "500ML Boxes";
                quantity = productInfo["500MLBoxes"];
                price = productInfo.price500ML
                subTotal = subTotal + productInfo.price500ML
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i, gstNo)
                j++;
            } else if (productInfo["300MLBoxes"] > 0) {
                product = "300ML Boxes";
                quantity = productInfo["300MLBoxes"];
                price = productInfo.price300ML
                subTotal = subTotal + productInfo.price300ML
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i, gstNo)
                j++;
            }
        }
    }

    function renderProductRow(doc, invoiceTableTop, j, product, quantity, price, address, index, i, gstNo) {
        const position = invoiceTableTop + j * 30;
        if (position == 60) {
            doc.addPage();
        }
        if (position >= 780) {
            invoiceTableTop = 0;
            j = 0;
        }
        let taxValue = quantity * price
        // let cgst = product == "20 Lt Bt Jar" ? CGST20L : CGSTOthers
        let gst = product == "20 Lt Bt Jar" ? GST20L : GSTOthers
        // let cgstValue = (taxValue * cgst) / 100
        const { amount, cgst, sgst, igst } = getResults({ quantity, price, gst, gstNo })
        generateIndividualTableRow(
            doc,
            position,
            product,
            HSNCODE,
            gst,
            quantity,
            price,
            amount,
            cgst,
            sgst,
            igst
        )
        totalTaxValue = totalTaxValue + amount
        totalCGSTValue = totalCGSTValue + cgst
        totalIGSTValue = totalIGSTValue + igst
    }
    let totalAmount = totalTaxValue + (2 * totalCGSTValue) + totalIGSTValue
    const subtotalPosition = (invoiceTableTop + (j + 1) * 30) + 98;
    generateHr(doc, subtotalPosition)
    doc
        .text(`Total:`, 320, subtotalPosition + 10)
        .text(Math.round(totalTaxValue), 380, subtotalPosition + 10)
        .text(Math.round(totalCGSTValue), 445, subtotalPosition + 10)
        .text(Math.round(totalCGSTValue), 488, subtotalPosition + 10)
        .text(Math.round(totalIGSTValue), 525, subtotalPosition + 10, { align: "right" })
    generateHr(doc, subtotalPosition + 30)
    doc
        .text("Invoice Value in Words Rs :", 30, subtotalPosition + 40)
        .text("Total Invoice Value Round off To :", 350, subtotalPosition + 40)
        .fillColor("red")
        .text(Math.round(totalAmount), 500, subtotalPosition + 40, { align: "right" })
        .text(convertToWords(Math.round(totalAmount)), 30, subtotalPosition + 60)
    generateHr(doc, subtotalPosition + 80)
    doc
        .fillColor("black")
        .fontSize(8)
        .text("Amount of tax subject to reverse charges : No", 30, subtotalPosition + 100)
        .text("Supply meant for export on payment of integrated tax.", 30, subtotalPosition + 120)
        .fillColor("red")
        .text("Bank Details : Acer Engineers Pvt Ltd,", 30, subtotalPosition + 150)
        .text("Karur Vysya Bank, Jubilee Hills Branch", 30, subtotalPosition + 160)
        .text("A/C No : 1451 2230 0000 0035", 30, subtotalPosition + 170)
        .text("IFSC : KVBL0001451", 30, subtotalPosition + 180)
        .fillColor("black")
        .text("for Acer Engineers Pvt Ltd", 0, subtotalPosition + 150, { align: "right" })
        .image("signature.png", 460, subtotalPosition + 160, { width: 80 })
        .text("Authorized Signatory", 0, subtotalPosition + 180, { align: "right" })
}
function billingTable(doc, invoice) {
    const item = invoice.items.length ? invoice.items[0] : {}
    const { Address1, deliveryAddress } = invoice
    const { customerId = "", customerName = "", organizationName = "", address = "", gstNo = "", mobileNumber = "" } = item
    const billingInfoTop = 160;
    const statusCode = (gstNo || '').slice(0, 2)

    doc
        .text("Details of receiver ( Billed to)", 30, billingInfoTop + 5)
        .text(`Customer Id : ${customerId}`, 200, billingInfoTop + 5)
        .text("Details of receiver ( Shipped to)", 350, billingInfoTop + 5)
    generateHr(doc, billingInfoTop + 18);
    generateVr(doc, 300, 160, 130)
    generateHr(doc, billingInfoTop + 130);
    doc
        .fontSize(10)
        .text(`${organizationName || customerName} `, 30, billingInfoTop + 30)
        .fontSize(8)
        .text(`${Address1}`, 30, billingInfoTop + 42, { width: 200 })
        .text(`Contact No: ${mobileNumber} `, 30, Address1.length > 50 ? billingInfoTop + 75 : billingInfoTop + 50, { width: 200 })
        .text(`GST NO: ${gstNo || "NA"} `, 30, billingInfoTop + 100)
        .text(`State Code: ${statusCode}`, 30, billingInfoTop + 115)
        .fontSize(10)
        .text(`${organizationName || customerName} `, 310, billingInfoTop + 30)
        .fontSize(8)
        .text(`${deliveryAddress}`, 310, billingInfoTop + 42, { width: 200 })
        .text(`Contact No: ${mobileNumber} `, 310, deliveryAddress.length > 50 ? billingInfoTop + 75 : billingInfoTop + 50, { width: 200 })
        .text(`GST NO: ${gstNo || "NA"} `, 310, billingInfoTop + 100)
        .text(`State Code: ${statusCode}`, 310, billingInfoTop + 115)

}
function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "This is computer generated invoice",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateIndividualTableRow(
    doc,
    y,
    product,
    hsnCode,
    GST,
    quantity,
    price,
    taxValue = 5420,
    CGST = 280,
    SGST = 280,
    IGST = 280
) {
    // console.log("y value:::" + y + "item:::");
    generateVr(doc, 125, y - 10, 140)
    generateVr(doc, 188, y - 10, 140)
    generateVr(doc, 240, y - 10, 140)
    generateVr(doc, 300, y - 10, 140)
    generateVr(doc, 365, y - 10, 140)
    generateVr(doc, 435, y - 10, 140)
    generateVr(doc, 480, y - 10, 140)
    generateVr(doc, 520, y - 10, 140)
    doc
        .fontSize(9)
        .text(product, 40, y, { align: "left" })
        .text(hsnCode, 130, y, { align: "left" })
        .text(GST, 200, y, { align: "left" })
        .text(quantity, 250, y, { align: "left" })
        .text(price, 310, y, { align: "left" })
        .text(taxValue, 370, y, { align: "left" })
        .text(CGST, 440, y, { align: "left" })
        .text(SGST, 490, y, { align: "left" })
        .text(IGST, 520, y, { align: "right" })
}

function generateHr(doc, y) {
    doc
        .lineWidth(1)
        .moveTo(25, y)
        .lineTo(570, y)
        .stroke();
}
function generateVr(doc, xAxis, yAxis, height) {
    doc
        .rect(xAxis, yAxis, 0, height)
}


function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}
const getResults = (row) => {
    let { quantity, price, discount = 0, gst, cgst, sgst, igst, gstNo } = row
    const isLocal = gstNo ? gstNo.startsWith('36') : true
    const priceAfterDiscount = price - (price / 100 * discount)
    const amount = Number((priceAfterDiscount * quantity).toFixed(2))
    const totalTax = (amount / 100 * gst)
    // cgst = Number((totalTax / 2).toFixed(2))
    // sgst = Number((totalTax / 2).toFixed(2))
    // igst = 0
    cgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    sgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    igst = isLocal ? 0.00 : Number((totalTax).toFixed(2))
    return { amount, cgst, sgst, igst }
}
module.exports = {
    createSingleDeliveryInvoice
};