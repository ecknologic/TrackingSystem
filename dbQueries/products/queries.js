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
    let query = `insert into productdetails (productName,price,tax,totalAmount) values(?,?,?,?)`;
    const { productName, price, tax } = input
    let totalAmount = (price * tax) / 100 + parseInt(price)
    let requestBody = [productName, price, tax, totalAmount]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
productQueries.updateProducts = (input, callback) => {
    const { productName, price, productId, tax } = input
    let totalAmount = (price * tax) / 100 + parseInt(price)
    let query = `update productdetails set productName=?,price=?,tax=?,totalAmount=? where productId=${productId}`;
    let requestBody = [productName, price, tax, totalAmount]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = productQueries