const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .image("bibo_logo.png", 50, 45, { width: 80 })
        .fillColor("#444444")
        .fontSize(15)
        .text("TAX INVOICE", 190, 45,)
        .underline(195, 48, 85, 10, { color: "red" })
        .fontSize(8)
        .text("Acer Engineers Pvt Ltd.", 200, 50, { align: "right" })
        .text("Plot No : 58,Amar Cooperative Society,Kavuri Hills,Hyderabad - 500 033,", 200, 65, { align: "right" })
        .text("Contact us : 040 4853 8777/ 91 90526 17329 ,email: Info@bibowater.com", 200, 80, { align: "right" })
        .text("GSTIN: 36AACCA3412D1ZD,PAN No: AACCA3412D", 200, 95, { align: "right" })

        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 120);

    generateHr(doc, 140);

    const customerInformationTop = 145;

    doc
        .fontSize(10)
        .text("Invoice No:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Period of supply:", 50, customerInformationTop + 30)
        .text(
            formatDate(new Date()) + '  to  ' + formatDate(new Date()),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(
            invoice.shipping.city +
            ", " +
            invoice.shipping.state +
            ", " +
            invoice.shipping.country,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    let invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "S.NO",
        "Address",
        "Product",
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
            item["20LCans"],
            item.price20L,
            // formatCurrency(item.amount / item.quantity),
            // formatCurrency(item.amount)
        );
        j++;
        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (j + 1) * 30;
    let { price20L: subTotal } = invoice.items.reduce(calculateSubTotal)
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        `Rs. ${subTotal}`
        // formatCurrency(subTotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(invoice.paid)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(invoice.subtotal - invoice.paid)
    );
    doc.font("Helvetica");
}
const calculateSubTotal = (total, num) => {
    return { price20L: total.price20L + num.price20L }
}
function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
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
    quantity,
    price
) {
    console.log("y value:::" + y + "item:::" + sno);
    doc
        .fontSize(10)
        .text(sno, 50, y)
        .text(address, 100, y, { width: 200, align: "center" })
        .text(product, 320, y)
        .text(quantity, 370, y, { width: 90, align: "center" })
        .text(price, 470, y, { width: 90, align: "center" })
    // .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
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