const { executeGetQuery, executePostOrUpdateQuery, executeGetParamsQuery } = require('../../utils/functions.js');
let invoiceQueries = {}

invoiceQueries.getInvoices = async (status, callback) => {
    let query = `select * from Invoice where status=? ORDER BY createdDateTime DESC`;
    return executeGetParamsQuery(query, [status], callback)
}

invoiceQueries.getInvoiceById = async (invoiceId, callback) => {
    let query = `select i.*,JSON_ARRAYAGG(json_object('key',p.id,'discount',p.discount,'productName',p.productName,'productPrice',ROUND(p.productPrice,1),'quantity',p.quantity,'tax',p.tax,'amount',p.amount,'cgst',p.cgst,'sgst',p.sgst,'igst',p.igst)) as products from Invoice i INNER JOIN invoiceProductsDetails p ON i.invoiceId=p.invoiceId where i.invoiceId=? AND p.deleted=0`;
    return executeGetParamsQuery(query, [invoiceId], callback)
}

invoiceQueries.getInvoiceId = async (callback) => {
    let query = "SELECT COUNT(invoiceId) AS invoiceId FROM  Invoice";
    return executeGetQuery(query, callback)
}

//POST Request Methods
invoiceQueries.createInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, TAndC, invoicePdf, invoiceId, hsnCode, poNo, totalAmount, customerName } = input
    let query = "insert into Invoice (customerId,invoiceDate,dueDate,salesPerson,mailSubject,mailIds,TAndC,invoicePdf,invoiceId,hsnCode,poNo,totalAmount,customerName) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, TAndC, invoicePdf, invoiceId, hsnCode, poNo, totalAmount, customerName]
    executePostOrUpdateQuery(query, requestBody, callback)
}
invoiceQueries.saveInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    const sql = products.map(item => "('" + invoiceId + "', '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ", " + item.amount + ")")
    let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount) values " + sql;
    executeGetQuery(query, callback)
}

invoiceQueries.updateInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, TAndC, invoicePdf, invoiceId, hsnCode, poNo, totalAmount, customerName } = input
    let query = "Update Invoice SET customerId=?,invoiceDate=?,dueDate=?,salesPerson=?,mailSubject=?,mailIds=?,TAndC=?,invoicePdf=?,hsnCode=?,poNo=?,totalAmount=?,customerName=? where invoiceId=?"
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, mailSubject, mailIds, TAndC, invoicePdf, hsnCode, poNo, totalAmount, customerName, invoiceId]
    executePostOrUpdateQuery(query, requestBody, callback)
}

invoiceQueries.updateInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    for (let i = 0; i < products.length; i++) {
        const { productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount, key, isNew = 0 } = products[i]
        if (isNew == 1) {
            let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount) values(?,?,?,?,?,?,?,?,?,?)";
            let requestBody = [invoiceId, productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount]
            if (i === products.length - 1) {
                executePostOrUpdateQuery(query, requestBody, callback)
            } else {
                executePostOrUpdateQuery(query, requestBody)
            }
        } else {
            let query = "update invoiceProductsDetails SET productName=?, productPrice=?, discount=?, quantity=?, tax=?,cgst=?,sgst=?,igst=?,amount=? WHERE id=?";
            if (i === products.length - 1) {
                return executeGetParamsQuery(query, [productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount, key], callback)
            } else {
                executeGetParamsQuery(query, [productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount, key])
            }
        }
    }
    // const sql = products.map(item => "('" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ", " + item.amount + ", " + item.key + ")")
}

invoiceQueries.deleteInvoiceProducts = (ids, callback) => {
    let query = "update invoiceProductsDetails SET deleted=1 WHERE id IN (?)";
    executePostOrUpdateQuery(query, [ids], callback)
}
invoiceQueries.updateInvoiceStatus = ({ invoiceId, status }, callback) => {
    let query = "update Invoice SET status=? WHERE invoiceId=?";
    executePostOrUpdateQuery(query, [status, invoiceId], callback)
}
module.exports = invoiceQueries