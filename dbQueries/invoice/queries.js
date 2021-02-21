const { executeGetQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let invoiceQueries = {}

invoiceQueries.getInvoices = async (callback) => {
    let query = `select * from Invoice ORDER BY createdDateTime DESC`;
    return executeGetQuery(query, callback)
}

//POST Request Methods
invoiceQueries.createInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, tAndc, invoicePdf } = input
    let query = "insert into Invoice (customerId,invoiceDate,dueDate,salesPerson,mailSubject,mailIds,tAndc,invoicePdf) values(?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, tAndc, invoicePdf]
    executePostOrUpdateQuery(query, requestBody, callback)
}
invoiceQueries.saveInvoiceProducts = (input, callback) => {
    const { invoiceId = 1, products } = input
    // const sql = products.map(item => `(${invoiceId},${String(item.productName)}, ${item.productPrice}, ${item.discount}, ${item.quantity}, ${item.tax})`)
    const sql = products.map(item => "(" + invoiceId + ", '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ")")
    let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax) values " + sql;
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    // let requestBody = [invoiceId, productName, productPrice, discount, quantity, tax]
    console.log(query)
    executeGetQuery(query, (err, data) => {
        if (err) console.log("ddd", err)
        else console.log("Data", data)
    })
}
module.exports = invoiceQueries