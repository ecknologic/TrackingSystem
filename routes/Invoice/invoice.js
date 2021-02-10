const fs = require("fs");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../../utils/functions");
const GST20L = 12, GSTOthers = 18, CGST20L = 6, CGSTOthers = 9;
var totalTaxValue = 0
var totalCGSTValue = 0
function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);
    billingTable(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}



function generateHeader(doc) {
    doc
        .rect(25, 25, 545, 80)
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
        .rect(25, 105, 545, 0)

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
    let sno = 1, totalPrice20L = 0, totalQuantity20L = 0, totalPrice1L = 0, totalQuantity1L = 0, totalPrice500ML = 0, totalQuantity500ML = 0, totalPrice250ML = 0, totalQuantity250ML = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        let product, quantity, price, address = item.address;
        let arr = [{ "20LCans": item["20LCans"], price20L: item.price20L }, { "1LBoxes": item["1LBoxes"], "price1L": item.price1L }, { "500MLBoxes": item["500MLBoxes"], "price500ML": item.price500ML }, { "250MLBoxes": item["250MLBoxes"], "price250ML": item.price250ML }]
        for (let [index, productInfo] of arr.entries()) {
            if (productInfo["20LCans"] > 0) {
                product = "20 Lt Bt Jar";
                quantity = productInfo["20LCans"];
                price = productInfo.price20L
                totalQuantity20L = totalQuantity20L + productInfo["20LCans"]
                totalPrice20L = totalPrice20L + productInfo.price20L
                subTotal = subTotal + productInfo.price20L
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["1LBoxes"] > 0) {
                product = "1L Boxes";
                quantity = productInfo["1LBoxes"];
                price = productInfo.price1L
                totalQuantity1L = totalQuantity1L + productInfo["1LBoxes"]
                totalPrice1L = totalPrice1L + productInfo.price1L
                subTotal = subTotal + productInfo.price1L
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["500MLBoxes"] > 0) {
                product = "500ML Boxes";
                quantity = productInfo["500MLBoxes"];
                price = productInfo.price500ML
                totalQuantity500ML = totalQuantity500ML + productInfo["500MLBoxes"]
                totalPrice500ML = totalPrice500ML + productInfo.price500ML
                subTotal = subTotal + productInfo.price500ML
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            } else if (productInfo["250MLBoxes"] > 0) {
                product = "300ML Boxes";
                quantity = productInfo["250MLBoxes"];
                price = productInfo.price250ML
                totalQuantity250ML = totalQuantity250ML + productInfo["250MLBoxes"]
                totalPrice250ML = totalPrice250ML + productInfo.price250ML
                subTotal = subTotal + productInfo.price250ML
                renderProductRow(doc, invoiceTableTop, jCount, product, quantity, price, address, index, i)
            }
        }
        if (i == (invoice.items.length - 1)) {
            totalArr.push({ product: "20 Lt Bt Jar", price: totalPrice20L, quantity: totalQuantity20L },
                { product: "1L Boxes", price: totalPrice1L, quantity: totalQuantity1L },
                { product: "500ML Boxes", price: totalPrice500ML, quantity: totalQuantity500ML },
                { product: "250ML Boxes", price: totalPrice250ML, quantity: totalQuantity250ML }
            )
        }
    }
    function renderProductRow(doc, tableTop, j, product, quantity, price, address, index, i) {
        const position = tableTop + (j + 1) * 20;
        if (position == 40) {
            generateHr(doc, position - 15)
            doc.addPage();
        }
        if (position >= 760) {
            doc
                .rect(25, 25, 545, position + 10)
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
    generateHr(doc, subtotalPosition - 15)
    doc
        .rect(25, subtotalPosition - 50, 545, 250)
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
            let taxValue = item.quantity * item.price
            let cgst = item.product == "20 Lt Bt Jar" ? CGST20L : CGSTOthers
            let gst = item.product == "20 Lt Bt Jar" ? GST20L : GSTOthers
            let cgstValue = (taxValue * cgst) / 100
            generateSummaryRow(doc, subtotalPosition + (index + 1) * 15,
                item.product,
                "22011010",
                gst,
                item.quantity,
                item.price,
                taxValue,
                cgstValue,
                cgstValue,
                0
            )
            totalTaxValue = totalTaxValue + taxValue
            totalCGSTValue = totalCGSTValue + cgstValue
        })
    }
    let totalAmount = totalTaxValue + (2 * totalCGSTValue)
    doc
        .text("Totals :", 290, subtotalPosition + 80)
        .text(totalTaxValue, 340, subtotalPosition + 80)
        .text(totalCGSTValue, 415, subtotalPosition + 80)
        .text(totalCGSTValue, 480, subtotalPosition + 80)
        .text("0.00", 500, subtotalPosition + 80, { align: "right" })
    generateHr(doc, subtotalPosition + 70)
    doc
        .text("Total Invoice Value Round off To :", 350, subtotalPosition + 100)
        .fillColor("red")
        .text(totalAmount, 500, subtotalPosition + 100, { align: "right" })
        .fillColor("black")
        .text("Invoice Value in Wards Rs :", 30, subtotalPosition + 120)
        .stroke()
        .text(convertToWords(totalAmount), 160, subtotalPosition + 120)
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
const calculateSubTotal = (total, num) => {
    return { price20L: total.price20L + num.price20L }
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
    console.log("y value:::" + y + "item:::" + sno);
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
    const { customerId = "", customerName = "", panNo = "", organizationName = "", address1 = "", address = "", gstNO = "", mobileNumber = "" } = item

    const billingInfoTop = 170;
    // const address = "1st Floor Solitaire Building Plot no 14 & 15,software unit layout, Madhapur , Hyderabad,500081 "

    doc
        .rect(25, 170, 545, billingInfoTop - 45)
        .text("Details of receiver ( Billed to)", 30, billingInfoTop + 5)
        .text(`Customer Id : ${customerId}`, 200, billingInfoTop + 5)
        .text("Details of receiver ( Shipped to)", 350, billingInfoTop + 5)
    generateHr(doc, billingInfoTop + 18);
    generateVr(doc, 300, billingInfoTop, 125)
    // generateHr(doc, billingInfoTop + 125);
    doc
        .fontSize(10)
        .text(organizationName || customerName, 30, billingInfoTop + 30)
        .fontSize(8)
        .text(`${address} , Contact No: ${mobileNumber}`, 30, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: ${gstNO} `, 30, billingInfoTop + 80)
        .text(`State Code: ${gstNO.substring(0, 2)}`, 190, billingInfoTop + 80)
        .text(`PAN NO: ${panNo}`, 30, billingInfoTop + 100)
        .text(`PO NO:`, 30, billingInfoTop + 110)
        .fontSize(10)
        .text(organizationName || customerName, 310, billingInfoTop + 30)
        .fontSize(8)
        .text(`${address} , Contact No: ${mobileNumber}`, 310, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: ${gstNO} `, 310, billingInfoTop + 80)
        .text(`State Code: ${gstNO.substring(0, 2)}`, 480, billingInfoTop + 80)
        .text(`PAN NO: ${panNo}`, 310, billingInfoTop + 100)
        .text(`PO NO:`, 310, billingInfoTop + 110)

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

module.exports = {
    createInvoice
};