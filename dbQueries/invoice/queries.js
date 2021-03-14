var fs = require('fs')
const { executeGetQuery, executePostOrUpdateQuery, executeGetParamsQuery } = require('../../utils/functions.js');
let invoiceQueries = {}

invoiceQueries.getInvoices = async (status, callback) => {
    let query = `select * from Invoice ORDER BY invoiceId DESC`;
    return executeGetQuery(query, callback)
}

invoiceQueries.getCustomerInvoices = async (customerId, callback) => {
    let query = `select * from Invoice where customerId=? ORDER BY invoiceId DESC`;
    return executeGetParamsQuery(query, [customerId], callback)
}

invoiceQueries.getInvoiceByStatus = async (status, callback) => {
    let query = `select * from Invoice where status=? ORDER BY updatedDateTime DESC`;
    return executeGetParamsQuery(query, [status], callback)
}

invoiceQueries.getInvoiceById = async (invoiceId, callback) => {
    let query = `select i.*,JSON_ARRAYAGG(json_object('key',p.id,'discount',p.discount,'productName',p.productName,'productPrice',ROUND(p.productPrice,1),'quantity',p.quantity,'tax',p.tax,'amount',ROUND(p.amount),'cgst',ROUND(p.cgst),'sgst',ROUND(p.sgst),'igst',ROUND(p.igst),'address',p.address)) as products,c.organizationName,c.customerType, c.gstNo, c.panNo, c.mobileNumber,c.Address1,p.address,d.address as deliveryAddress from Invoice i INNER JOIN invoiceProductsDetails p ON i.invoiceId=p.invoiceId INNER JOIN customerdetails c ON c.customerId=i.customerId INNER JOIN DeliveryDetails d ON d.customer_Id=i.customerId where i.invoiceId=? AND p.deleted=0`;
    return executeGetParamsQuery(query, [invoiceId], callback)
}

invoiceQueries.getInvoiceId = async (callback) => {
    let query = "SELECT COUNT(invoiceId) AS invoiceId FROM  Invoice";
    return executeGetQuery(query, callback)
}
invoiceQueries.getInvoivesCount = async (callback) => {
    let query = "SELECT COUNT(*) AS totalCount,status FROM Invoice GROUP BY status";
    return executeGetQuery(query, callback)
}

//POST Request Methods
invoiceQueries.createInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, fromDate, toDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName } = input
    let query = "insert into Invoice (customerId,invoiceDate,dueDate,salesPerson,invoiceId,hsnCode,poNo,totalAmount,customerName,fromDate,toDate) values(?,?,?,?,?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName, fromDate, toDate]
    executePostOrUpdateQuery(query, requestBody, callback)
}

invoiceQueries.saveInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    const sql = products.map(item => "('" + invoiceId + "', '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ", " + item.amount + ",'" + item.address + "')")
    let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount,address) values " + sql;
    executeGetQuery(query, callback)
}

invoiceQueries.saveInvoicePdf = (input, callback) => {
    const { invoiceId } = input
    let query = "update Invoice set invoicePdf=? where invoiceId='" + invoiceId + "'"
    fs.readFile("invoice.pdf", (err, result) => {
        executePostOrUpdateQuery(query, [result], callback)
    })
}

invoiceQueries.updateInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, fromDate, toDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName } = input
    let query = "Update Invoice SET customerId=?,invoiceDate=?,dueDate=?,salesPerson=?,hsnCode=?,poNo=?,totalAmount=?,customerName=?,fromDate=?,toDate=? where invoiceId=?"
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, hsnCode, poNo, totalAmount, customerName, fromDate, toDate, invoiceId]
    executePostOrUpdateQuery(query, requestBody, callback)
}

invoiceQueries.updateInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    for (let i = 0; i < products.length; i++) {
        const { productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount, key, isNew = 0, address } = products[i]
        if (isNew == 1) {
            let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount,address) values(?,?,?,?,?,?,?,?,?,?,?)";
            let requestBody = [invoiceId, productName, productPrice, discount, quantity, tax, cgst, sgst, igst, amount, address]
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
    let query = "update Invoice SET updatedDateTime=?, status=? WHERE invoiceId=?";
    executePostOrUpdateQuery(query, [new Date(), status, invoiceId], callback)
}
module.exports = invoiceQueries