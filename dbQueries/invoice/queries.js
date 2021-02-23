const { executeGetQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let invoiceQueries = {}

invoiceQueries.getInvoices = async (callback) => {
    let query = `select * from Invoice ORDER BY createdDateTime DESC`;
    return executeGetQuery(query, callback)
}

invoiceQueries.getInvoiceId = async (callback) => {
    let query = "SELECT COUNT(invoiceId) AS invoiceId FROM  Invoice";
    return executeGetQuery(query, callback)
}

//POST Request Methods
invoiceQueries.createInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, tAndc, invoicePdf, invoiceNumber, hsnCode, poNo } = input
    let query = "insert into Invoice (customerId,invoiceDate,dueDate,salesPerson,mailSubject,mailIds,tAndc,invoicePdf,invoiceId,hsnCode,poNo) values(?,?,?,?,?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, tAndc, invoicePdf, invoiceNumber, hsnCode, poNo]
    executePostOrUpdateQuery(query, requestBody, callback)
}
invoiceQueries.saveInvoiceProducts = (input, callback) => {
    const { invoiceId = 1, products } = input
    // const sql = products.map(item => `(${invoiceId},${String(item.productName)}, ${item.productPrice}, ${item.discount}, ${item.quantity}, ${item.tax})`)
    const sql = products.map(item => "(" + invoiceId + ", '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ")")
    let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst) values " + sql;
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    // let requestBody = [invoiceId, productName, productPrice, discount, quantity, tax]
    console.log(query)
    executeGetQuery(query, callback)
}
module.exports = invoiceQueries