const fs = require("fs");
const PDFDocument = require("pdfkit");

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
        .rect(25, 20, 545, 80)
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
        .rect(25, 105, 545, 60)

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
    let invoiceTableTop = 300;

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
    generateHr(doc, invoiceTableTop + 20);

    doc.font("Helvetica");


    for (i = 0, j = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];

        const position = invoiceTableTop + (j + 1) * 30;
        if (position == 60) {
            doc.addPage();
        }
        if (position >= 780) {
            invoiceTableTop = 0;
            j = 0;
        }

        generateTableRow(
            doc,
            position,
            i + 1,
            item.address,
            "20 Lt Bt Jar",
            "22011010",
            item["20LCans"],
            item.price20L,
            // formatCurrency(item.amount / item.quantity),
            // formatCurrency(item.amount)
        );
        j++;
        generateHr(doc, position + 20);

        const subtotalPosition = (invoiceTableTop + (j + 1) * 30) + 98;
        generateHr(doc, subtotalPosition)
        doc
            .rect(25, subtotalPosition - 50, 545, 250)
            .text("SUMMARY", 30, subtotalPosition - 40)
            .text("Product", 30, subtotalPosition - 20)
            .text("HSN Code", 100, subtotalPosition - 20)
            .text("% GST", 170, subtotalPosition - 20)
            .text("Quantity", 200, subtotalPosition - 20, { width: 90, align: "center" })
            .text("Price", 250, subtotalPosition - 20, { width: 90, align: "center" })
            .text("Taxable Value", 310, subtotalPosition - 20, { width: 90, align: "center" })
            .text("CGST", 400, subtotalPosition - 20, { width: 90, align: "center" })
            .text("SGST", 450, subtotalPosition - 20, { width: 90, align: "center" })
            .text("IGST", 500, subtotalPosition - 20, { width: 90, align: "center" })
            .text("Totals :", 270, subtotalPosition + 10)
            .text("11265.41", 320, subtotalPosition + 10)
            .text("900.62", 415, subtotalPosition + 10)
            .text("900.62", 470, subtotalPosition + 10)
            .text("0.00", 500, subtotalPosition + 10, { align: "right" })            
        generateHr(doc, subtotalPosition + 30)
        doc
            .text("Total Invoice Value Round off To :", 350, subtotalPosition + 40)
            .fillColor("red")
            .text("13067.00", 500, subtotalPosition + 40, { align: "right" })
            .fillColor("black")
            .text("Invoice Value in Wards Rs :", 30, subtotalPosition + 60)
            .stroke()
            .text("THIRTEEN THOUSAND SIXTY-SEVEN ONLY", 160, subtotalPosition + 60)
        doc
            .fillColor("black")
            .fontSize(8)
            .fillColor("red")
            .text("Bank Details : Acer Engineers Pvt Ltd,", 30, subtotalPosition + 110)
            .text("Karur Vysya Bank, Jubilee Hills Branch", 30, subtotalPosition + 120)
            .text("A/C No : 1451 2230 0000 0035", 30, subtotalPosition + 130)
            .text("IFSC : KVBL0001451", 30, subtotalPosition + 140)
            .fillColor("black")
            .text("for Acer Engineers Pvt Ltd", 0, subtotalPosition + 110, { align: "right" })
            .image("signature.png", 460, subtotalPosition + 120, { width: 80 })
            .text("Authorized Signatory", 0, subtotalPosition + 140, { align: "right" })
    }
}
const calculateSubTotal = (total, num) => {
    return { price20L: total.price20L + num.price20L }
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
    const billingInfoTop = 170;
    const address = "1st Floor Solitaire Building Plot no 14 & 15,software unit layout, Madhapur , Hyderabad,500081 "

    doc
        .rect(25, 170, 545, billingInfoTop - 45)
        .text("Details of receiver ( Billed to)", 30, billingInfoTop + 5)
        .text("Customer Id : ", 200, billingInfoTop + 5)
        .text("Details of receiver ( Shipped to)", 350, billingInfoTop + 5)
    generateHr(doc, billingInfoTop + 18);
    generateVr(doc, 300, 165, 130)
    // generateHr(doc, billingInfoTop + 125);
    doc
        .fontSize(10)
        .text("Pennywise Solutions Private Limited", 30, billingInfoTop + 30)
        .fontSize(8)
        .text(`${address} , Contact No: 9908599589`, 30, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: 36AAECP0333L1ZH `, 30, billingInfoTop + 80)
        .text(`State Code: 36`, 190, billingInfoTop + 80)
        .text(`PAN NO:`, 30, billingInfoTop + 100)
        .text(`PO NO:`, 30, billingInfoTop + 110)
        .fontSize(10)
        .text("Pennywise Solutions Private Limited", 310, billingInfoTop + 30)
        .fontSize(8)
        .text(`${address} , Contact No: 9908599589`, 310, billingInfoTop + 42, { width: 200 })
        .text(`GST NO: 36AAECP0333L1ZH `, 310, billingInfoTop + 80)
        .text(`State Code: 36`, 480, billingInfoTop + 80)
        .text(`PAN NO:`, 310, billingInfoTop + 100)
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