const { encryptObj } = require('../../utils/crypto.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let vendorQueries = {}

vendorQueries.getVendors = async (callback) => {
    let query = "SELECT * from vendors WHERE deleted=0 ORDER BY createdDateTime DESC";
    return executeGetQuery(query, callback)
}

vendorQueries.getVendorNames = async (callback) => {
    let query = "SELECT vendorId as dropdownId,vendorName as name,vendorName as value from vendors WHERE deleted=0 AND isActive=1 ORDER BY createdDateTime DESC";
    return executeGetQuery(query, callback)
}

vendorQueries.getVendorById = async (vendorId, callback) => {
    let query = "SELECT vendorId,vendorName, contactPerson, address, gstNo, customerName, accountNumber, ifscCode, bankName, branchName, creditPeriod, itemsSupplied, remarks,isActive from vendors where deleted=0 AND vendorId=" + vendorId;
    return executeGetQuery(query, callback)
}

vendorQueries.saveVendor = async (input, callback) => {
    let query = `insert into vendors (vendorName,contactPerson,address,gstNo,customerName,accountNumber,ifscCode,bankName,branchName,creditPeriod,itemsSupplied,remarks,createdDateTime) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const { vendorName, contactPerson, address, gstNo, customerName, accountNumber, ifscCode, bankName, branchName, creditPeriod, itemsSupplied, remarks } = input
    let encryptedData = await encryptObj({ accountNumber, ifscCode, bankName, branchName })
    let requestBody = [vendorName, contactPerson, address, gstNo, customerName, encryptedData.accountNumber, encryptedData.ifscCode, encryptedData.bankName, encryptedData.branchName, creditPeriod, itemsSupplied, remarks, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

vendorQueries.updateVendor = async (input, callback) => {
    const { vendorName, contactPerson, address, gstNo, customerName, accountNumber, ifscCode, bankName, branchName, creditPeriod, itemsSupplied, remarks, vendorId } = input
    let query = `update vendors set vendorName=?, contactPerson=?, address=?, gstNo=?, customerName=?, accountNumber=?, ifscCode=?, bankName=?, branchName=?, creditPeriod=?, itemsSupplied=?, remarks=? where vendorId=${vendorId}`;
    let encryptedData = await encryptObj({ accountNumber, ifscCode, bankName, branchName })
    let requestBody = [vendorName, contactPerson, address, gstNo, customerName, encryptedData.accountNumber, encryptedData.ifscCode, encryptedData.bankName, encryptedData.branchName, creditPeriod, itemsSupplied, remarks]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

vendorQueries.updateVendorStatus = async (input, callback) => {
    const { isActive, vendorId } = input
    let query = `update vendors set isActive=? where vendorId=${vendorId}`;
    let requestBody = [isActive]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

vendorQueries.deleteVendor = async (input, callback) => {
    const { vendorId } = input
    let query = `update vendors set deleted=? where vendorId=${vendorId}`;
    let requestBody = [1]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = vendorQueries