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
    let query = `insert into productdetails (productName,price) values(?,?)`;
    const { productName, price } = input
    let requestBody = [productName, price]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
productQueries.updateProducts = (input, callback) => {
    const { productName, price, productId } = input
    let query = `update productdetails set productName=?,price=? where productId=${productId}`;
    let requestBody = [productName, price]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = productQueries