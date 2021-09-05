const { constants } = require('../../utils/constants.js');
const { encryptObj } = require('../../utils/crypto.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let stockRequestQueries = {}

stockRequestQueries.getDepartmentStockRequests = async (input, callback) => {
    const { departmentId, userRole } = input
    let query = `SELECT d.*,JSON_ARRAYAGG(JSON_OBJECT('productId',r.productId,'noOfJarsTobePlaced',r.noOfJarsTobePlaced,'departmentId',r.departmentId,
    'requestId',r.requestId,
    'productName',r.productName, 'departmentType',r.departmentType)) as products, dep.departmentName from departmentstockrequests d INNER JOIN requestedproducts r ON r.requestId=d.requestId INNER JOIN departmentmaster dep ON d.requestTo=dep.departmentId WHERE d.departmentId=? GROUP BY r.requestId ORDER BY createdDateTime DESC`;

    if (userRole != constants.WAREHOUSEADMIN) {
        query = `SELECT d.*,JSON_ARRAYAGG(JSON_OBJECT('productId',r.productId,'noOfJarsTobePlaced',r.noOfJarsTobePlaced,'departmentId',r.departmentId,
        'requestId',r.requestId,
        'productName',r.productName, 'departmentType',r.departmentType)) as products, dep.departmentName from departmentstockrequests d INNER JOIN requestedproducts r ON r.requestId=d.requestId INNER JOIN departmentmaster dep ON d.departmentId=dep.departmentId WHERE d.requestTo=? GROUP BY r.requestId ORDER BY createdDateTime DESC`
    }

    return executeGetParamsQuery(query, [departmentId], callback)
}

stockRequestQueries.getDepartmentStockRequestById = async (input, callback) => {
    const { departmentId, requestId } = input
    let query = `SELECT d.*,JSON_ARRAYAGG(JSON_OBJECT('productId',r.productId,'noOfJarsTobePlaced',r.noOfJarsTobePlaced,'departmentId',r.departmentId,
    'requestId',r.requestId,
    'productName',r.productName, 'departmentType',r.departmentType)) as products from departmentstockrequests d INNER JOIN requestedproducts p ON p.requestId=d.requestId WHERE d.departmentId=? AND requestId=? ORDER BY createdDateTime DESC`;
    return executeGetParamsQuery(query, [departmentId, requestId], callback)
}

stockRequestQueries.requestStock = async (input, callback) => {
    let query = `insert into departmentstockrequests (departmentId,requestTo,requiredDate,createdDateTime) values(?,?,?,?)`;
    const { departmentId, requestTo, requiredDate } = input
    let requestBody = [departmentId, requestTo, requiredDate, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

stockRequestQueries.updateRequestStock = async (input, callback) => {
    const { requestId } = input
    let query = `update departmentstockrequests set requestTo=?, requiredDate=? where requestId=${requestId}`;
    let requestBody = [requestTo, requiredDate]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

stockRequestQueries.updateRequestedStockStatus = async (input, callback) => {
    const { requestId, status, reason } = input
    let query = `update departmentstockrequests set status=?,reason=? where requestId=${requestId}`;
    let requestBody = [status, reason]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

stockRequestQueries.saveRequestedStockDetails = ({ products, requestId, departmentId }, callback) => {
    const departmentType = 'Warehouse';
    if (products.length) {
        const sql = products.map(item => "(" + requestId + ", " + departmentId + ", " + item.noOfJarsTobePlaced + ", '" + item.productName + "'" + ", '" + departmentType + "')")
        let query = `insert into requestedproducts (requestId, departmentId, noOfJarsTobePlaced, productName,departmentType) values ` + sql;
        executeGetQuery(query, callback);
    }
}

module.exports = stockRequestQueries