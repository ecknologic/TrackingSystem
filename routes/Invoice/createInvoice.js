const fs = require("fs");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../../utils/functions");
const HSNCODE = 22011010;
const GST20L = 12, GSTOthers = 18, CGST20L = 6, CGSTOthers = 9;
var totalTaxValue = 0
var totalCGSTValue = 0
function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    billingTable(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
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
    doc
        .fillColor("#444444")
    generateHr(doc, 100);

    const customerInformationTop = 110;

    doc
        .fontSize(10)
        .text("Original for receipient", 0, customerInformationTop, { align: "right" })
        .text("Duplicate for transporter", { align: "right" })
        .text("Triplicate for supplier", { align: "right" })
        .text("Invoice No:", 40, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 40, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Period of supply:", 40, customerInformationTop + 30)
        .text(
            formatDate(new Date()) + '  to  ' + formatDate(new Date()),
            150,
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
        const item = invoice.items[i];
        let product, quantity, price, address = item.address;
        let arr = [{ "20LCans": item["20LCans"], price20L: item.price20L }, { "1LBoxes": item["1LBoxes"], "price1L": item.price1L }, { "500MLBoxes": item["500MLBoxes"], "price500ML": item.price500ML }, { "250MLBoxes": item["250MLBoxes"], "price250ML": item.price250ML }]
        for (let [index, productInfo] of arr.entries()) {
            if (productInfo["20LCans"] > 0) {
                product = "20 Lt Bt Jar";
                quantity = productInfo["20LCans"];
                price = productInfo.price20L
                subTotal = subTotal + productInfo.price20L
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i)
                j++;
            } else if (productInfo["1LBoxes"] > 0) {
                product = "1L Boxes";
                quantity = productInfo["1LBoxes"];
                price = productInfo.price1L
                subTotal = subTotal + productInfo.price1L
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i)
                j++;
            } else if (productInfo["500MLBoxes"] > 0) {
                product = "500ML Boxes";
                quantity = productInfo["500MLBoxes"];
                price = productInfo.price500ML
                subTotal = subTotal + productInfo.price500ML
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i)
                j++;
            } else if (productInfo["250MLBoxes"] > 0) {
                product = "300ML Boxes";
                quantity = productInfo["250MLBoxes"];
                price = productInfo.price250ML
                subTotal = subTotal + productInfo.price250ML
                renderProductRow(doc, invoiceTableTop + 27, j, product, quantity, price, address, index, i)
                j++;
            }
        }
    }

    function renderProductRow(doc, invoiceTableTop, j, product, quantity, price, address, index, i) {
        const position = invoiceTableTop + j * 30;
        if (position == 60) {
            doc.addPage();
        }
        if (position >= 780) {
            invoiceTableTop = 0;
            j = 0;
        }
        let taxValue = quantity * price
        let cgst = product == "20 Lt Bt Jar" ? CGST20L : CGSTOthers
        let gst = product == "20 Lt Bt Jar" ? GST20L : GSTOthers
        let cgstValue = (taxValue * cgst) / 100
        generateIndividualTableRow(
            doc,
            position,
            product,
            HSNCODE,
            gst,
            quantity,
            price,
            taxValue,
            cgstValue,
            cgstValue,
            0.00
        )
        totalTaxValue = totalTaxValue + taxValue
        totalCGSTValue = totalCGSTValue + cgstValue
    }
    let totalAmount = totalTaxValue + (2 * totalCGSTValue)
    const subtotalPosition = (invoiceTableTop + (j + 1) * 30) + 98;
    generateHr(doc, subtotalPosition)
    doc
        .text(`Total:`, 320, subtotalPosition + 10)
        .text(totalTaxValue, 380, subtotalPosition + 10)
        .text(totalCGSTValue, 445, subtotalPosition + 10)
        .text(totalCGSTValue, 488, subtotalPosition + 10)
        .text("0.00", 525, subtotalPosition + 10, { align: "right" })
    generateHr(doc, subtotalPosition + 30)
    doc
        .text("Invoice Value in Words Rs :", 30, subtotalPosition + 40)
        .text("Total Invoice Value Round off To :", 350, subtotalPosition + 40)
        .fillColor("red")
        .text(totalAmount, 500, subtotalPosition + 40, { align: "right" })
        .text(convertToWords(totalAmount), 30, subtotalPosition + 60)
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
        .text("for Acer Engineers Pvt Ltd", 0, subtotalPosition + 190, { align: "right" })
        .image("signature.png", 460, subtotalPosition + 200, { width: 80 })
        .text("Authorized Signatory", 0, subtotalPosition + 220, { align: "right" })
}
function billingTable(doc, invoice) {
    const item = invoice.items.length ? invoice.items[0] : {}
    const { customerId = "", customerName = "", organizationName = "", address1 = "", address = "", gstNO = "", mobileNumber = "" } = item
    const billingInfoTop = 160;

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
        .text(`${address1} , Contact No: ${mobileNumber} `, 30, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: ${gstNO} `, 30, billingInfoTop + 100)
        .text(`State Code: 36`, 30, billingInfoTop + 115)
        .fontSize(10)
        .text(`${organizationName || customerName} `, 310, billingInfoTop + 30)
        .fontSize(8)
        .text(`${address} , Contact No: ${mobileNumber} `, 310, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: ${gstNO} `, 310, billingInfoTop + 100)
        .text(`State Code: 36`, 310, billingInfoTop + 115)

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
    console.log("y value:::" + y + "item:::");
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

module.exports = {
    createInvoice
};