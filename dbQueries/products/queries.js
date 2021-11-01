const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let productQueries = {}

productQueries.getProducts = async (callback) => {
    let query = "SELECT * from productdetails ORDER BY createdDateTime DESC";
    return executeGetQuery(query, callback)
}
productQueries.getProductById = async (productId, callback) => {
    let query = "SELECT * from productdetails where productId=" + productId;
    return executeGetQuery(query, callback)
}
productQueries.saveProduct = (input, callback) => {
    let query = `insert into productdetails (productName,price,tax,totalAmount,hsnCode) values(?,?,?,?,?)`;
    const { productName, price, tax, hsnCode } = input
    let totalAmount = (price * tax) / 100 + Number(price)
    totalAmount = totalAmount.toFixed(2)
    let requestBody = [productName, price, tax, totalAmount, hsnCode]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
productQueries.updateProducts = (input, callback) => {
    const { productName, price, productId, tax, hsnCode } = input
    let totalAmount = (price * tax) / 100 + Number(price)
    totalAmount = totalAmount.toFixed(2)
    let query = `update productdetails set productName=?,price=?,tax=?,totalAmount=?,hsnCode=? where productId=${productId}`;
    let requestBody = [productName, price, tax, totalAmount, hsnCode]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

productQueries.updateProductStatus = (input, callback) => {
    const { status, productId } = input
    let query = `update productdetails set status=? where productId=${productId}`;
    let requestBody = [status]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = productQueries