const fs = require("fs");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../../utils/functions");
const GST20L = 12, GSTOthers = 18, CGST20L = 6, CGSTOthers = 9;
var totalTaxValue = 0
var totalCGSTValue = 0
var totalIGSTValue = 0
function createMultiDeliveryInvoice(invoice, path) {
    return new Promise((resolve) => {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        totalCGSTValue = 0
        totalTaxValue = 0
        totalIGSTValue = 0

        generateHeader(doc, invoice);
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
        .rect(25, 25, 545, 800)
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
    let invoiceTableTop = 305, jCount = 0;
    let totalArr = []

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "S.NO",
        "Address",
        "Product",
        "HSN CODE",
        "Quantity",
        "Price",
        // "Line Total"
    );
    generateHr(doc, invoiceTableTop + 10);

    doc.font("Helvetica");
    let sno = 1, totalPrice20L = 0, totalQuantity20L = 0, totalPrice1L = 0, totalQuantity1L = 0, totalPrice500ML = 0, totalQuantity500ML = 0, totalPrice300ML = 0, totalQuantity300ML = 0, totalPrice2L = 0, totalQuantity2L = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        let product, quantity, price, address = item.address;
        let arr = [{ "20LCans": item["20LCans"], price20L: item.price20L }, { "1LBoxes": item["1LBoxes"], "price1L": item.price1L }, { "500MLBoxes": item["500MLBoxes"], "price500ML": item.price500ML }, { "300MLBoxes": item["300MLBoxes"], "price300ML": item.price300ML }, { "2LBoxes": item["2LBoxes"], "price2L": item.price2L }]
        for (let [index, productInfo] of arr.entries()) {
            if (productInfo["20LCans"] > 0) {
                product = "20 Lt Bt Jar";
                quantity = productInfo["20LCans"];
                price = productInfo.price20L
                totalQuantity20L += productInfo["20LCans"]
                totalPrice20L += productInfo.price20L
                subTotal += productInfo.price20L
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["2LBoxes"] > 0) {
                product = "2L Boxes";
                quantity = productInfo["2LBoxes"];
                price = productInfo.price2L
                totalQuantity2L += productInfo["2LBoxes"]
                totalPrice2L += productInfo.price2L
                subTotal += productInfo.price2L
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["1LBoxes"] > 0) {
                product = "1L Boxes";
                quantity = productInfo["1LBoxes"];
                price = productInfo.price1L
                totalQuantity1L += productInfo["1LBoxes"]
                totalPrice1L += productInfo.price1L
                subTotal += productInfo.price1L
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["500MLBoxes"] > 0) {
                product = "500ML Boxes";
                quantity = productInfo["500MLBoxes"];
                price = productInfo.price500ML
                totalQuantity500ML += productInfo["500MLBoxes"]
                totalPrice500ML += productInfo.price500ML
                subTotal += productInfo.price500ML
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["300MLBoxes"] > 0) {
                product = "300ML Boxes";
                quantity = productInfo["300MLBoxes"];
                price = productInfo.price300ML
                totalQuantity300ML += productInfo["300MLBoxes"]
                totalPrice300ML += productInfo.price300ML
                subTotal += productInfo.price300ML
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            }

        }
        if (i == (invoice.items.length - 1)) {
            const { gstNo } = item
            totalArr.push({ gstNo, product: "20 Lt Bt Jar", price: totalPrice20L, quantity: totalQuantity20L },
                { gstNo, product: "1L Boxes", price: totalPrice1L, quantity: totalQuantity1L },
                { gstNo, product: "500ML Boxes", price: totalPrice500ML, quantity: totalQuantity500ML },
                { gstNo, product: "300ML Boxes", price: totalPrice300ML, quantity: totalQuantity300ML },
                { gstNo, product: "2L Boxes", price: totalPrice2L, quantity: totalQuantity2L }
            )
        }
    }
    function renderProductRow(doc, tableTop, j, product, quantity, price, address, index, i) {
        const position = tableTop + (j + 1) * 20;
        if (position == 40) {
            // generateHr(doc, position - 15)
            doc.addPage()
                .rect(25, 25, 545, 800)
                .stroke()
        }
        if (position >= 760) {
            invoiceTableTop = 0;
            jCount = 0;
        }
        generateTableRow(
            doc,
            position,
            sno,
            address,
            product,
            "22011010",
            quantity,
            price,
            // formatCurrency(item.amount / item.quantity),
            // formatCurrency(item.amount)
        );
        jCount++; sno++
    }

    // generateHr(doc, position + 20);
    const subtotalPosition = (invoiceTableTop + (jCount + 1) * 20) + 98;
    generateHr(doc, subtotalPosition - 10)
    generateHr(doc, subtotalPosition - 45)
    doc
        .text("SUMMARY", 30, subtotalPosition - 40)
    generateSummaryRow(doc, subtotalPosition - 5,
        "Product",
        "HSN Code",
        "% GST",
        "Quantity",
        "Price",
        "Taxable Value",
        "CGST",
        "SGST",
        "IGST"
    )
    if (totalArr.length) {
        totalArr.map((item, index) => {
            const { quantity, price, gstNo } = item
            // let taxValue = item.quantity * item.price
            // let cgst = item.product == "20 Lt Bt Jar" ? CGST20L : CGSTOthers
            let gst = item.product == "20 Lt Bt Jar" ? GST20L : GSTOthers
            // let cgstValue = (taxValue * cgst) / 100
            const { amount, cgst, sgst, igst } = getResults({ quantity, price, gst, gstNo })
            generateSummaryRow(doc, subtotalPosition + (index + 1) * 15,
                item.product,
                "22011010",
                gst,
                item.quantity,
                item.price,
                amount,
                cgst,
                sgst,
                igst
            )
            totalTaxValue = totalTaxValue + amount
            totalCGSTValue = totalCGSTValue + cgst
            totalIGSTValue = totalIGSTValue + igst
        })
    }
    let totalAmount = Math.round(totalTaxValue + (2 * totalCGSTValue) + totalIGSTValue)
    doc
        .text("Totals :", 290, subtotalPosition + 80)
        .text(Math.round(totalTaxValue), 340, subtotalPosition + 80)
        .text(Math.round(totalCGSTValue), 415, subtotalPosition + 80)
        .text(Math.round(totalCGSTValue), 480, subtotalPosition + 80)
        .text(Math.round(totalIGSTValue), 500, subtotalPosition + 80, { align: "right" })
    generateHr(doc, subtotalPosition + 70)
    doc
        .text("Total Invoice Value Round off To :", 350, subtotalPosition + 100)
        .fillColor("red")
        .text(Math.round(totalAmount), 500, subtotalPosition + 100, { align: "right" })
        .fillColor("black")
        .text("Invoice Value in Wards Rs :", 30, subtotalPosition + 120)
        .stroke()
        .text(convertToWords(Math.round(totalAmount)), 160, subtotalPosition + 120)
    doc
        .fillColor("black")
        .fontSize(8)
        .fillColor("red")
        .text("Bank Details : Acer Engineers Pvt Ltd,", 30, subtotalPosition + 140)
        .text("Karur Vysya Bank, Jubilee Hills Branch", 30, subtotalPosition + 150)
        .text("A/C No : 1451 2230 0000 0035", 30, subtotalPosition + 160)
        .text("IFSC : KVBL0001451", 30, subtotalPosition + 170)
        .fillColor("black")
        .text("for Acer Engineers Pvt Ltd", 0, subtotalPosition + 140, { align: "right" })
        .image("signature.png", 460, subtotalPosition + 150, { width: 80 })
        .text("Authorized Signatory", 0, subtotalPosition + 170, { align: "right" })
}

function generateSummaryRow(doc, subtotalPosition, product, hsnCode, gst, quantity, price, taxAmount, cgst, sgst, igst) {
    doc
        .text(product, 30, subtotalPosition - 20)
        .text(hsnCode, 100, subtotalPosition - 20)
        .text(gst, 150, subtotalPosition - 20, { width: 90, align: "center" })
        .text(quantity, 200, subtotalPosition - 20, { width: 90, align: "center" })
        .text(price, 250, subtotalPosition - 20, { width: 90, align: "center" })
        .text(taxAmount, 310, subtotalPosition - 20, { width: 90, align: "center" })
        .text(cgst, 390, subtotalPosition - 20, { width: 90, align: "center" })
        .text(sgst, 450, subtotalPosition - 20, { width: 90, align: "center" })
        .text(igst, 500, subtotalPosition - 20, { width: 90, align: "center" })
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

function generateTableRow(
    doc,
    y,
    sno,
    address,
    product,
    hsnCode,
    quantity,
    price
) {
    // console.log("y value:::" + y + "item:::" + sno);
    doc
        .fontSize(10)
        .text(sno, 50, y)
        .text(address, 80, y, { width: 200, align: "center" })
        .text(product, 280, y)
        .text(hsnCode, 370, y)
        .text(quantity, 420, y, { width: 90, align: "center" })
        .text(price, 500, y, { width: 90, align: "center" })
    // .text(lineTotal, 0, y, { align: "right" });
}

function billingTable(doc, invoice) {
    const item = invoice.items.length ? invoice.items[0] : {}
    const { Address1 } = invoice
    const { customerId = "", customerName = "", organizationName = "", address = "", gstNo = "NA", mobileNumber = "" } = item
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
        .text(`${Address1}`, 310, billingInfoTop + 42, { width: 200 })
        .text(`Contact No: ${mobileNumber} `, 310, Address1.length > 50 ? billingInfoTop + 75 : billingInfoTop + 50, { width: 200 })
        .text(`GST NO: ${gstNo || "NA"} `, 310, billingInfoTop + 100)
        .text(`State Code: ${statusCode}`, 310, billingInfoTop + 115)

}
function generateHr(doc, y) {
    doc
        // .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(25, y)
        .lineTo(570, y)
        .stroke();
}
function generateVr(doc, xAxis, yAxis, height) {
    doc
        // .strokeColor("#aaaaaa")
        .rect(xAxis, yAxis, 0, height)
    // .moveTo(25, y)
    // .lineTo(570, y)
    // .stroke();
}

function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
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
    cgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    sgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
    igst = isLocal ? 0.00 : Number((totalTax).toFixed(2))
    return { amount, cgst, sgst, igst }
}
module.exports = {
    createMultiDeliveryInvoice
};