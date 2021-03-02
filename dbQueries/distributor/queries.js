const { executeGetQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let distributorQueries = {}

distributorQueries.getDistributors = async (callback) => {
    let query = `select distributorId,createdDateTime,agencyName,contactPerson,mobileNumber,address,isActive,operationalArea from Distributors ORDER BY createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
distributorQueries.getDistributorsList = async (callback) => {
    let query = `select distributorId,agencyName from Distributors WHERE isActive=1 ORDER BY createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
distributorQueries.getDistributorById = async (distributorId, callback) => {
    let query = `select * from Distributors where distributorId=${distributorId}`;
    return executeGetQuery(query, callback)
}

//POST Request Methods
distributorQueries.createDistributor = (input, callback) => {
    const { agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProof, operationalArea, createdBy } = input
    let query = "insert into Distributors (agencyName,contactPerson,mobileNumber,alternateNumber,address,mailId,alternateMailId,gstNo,gstProof,operationalArea,createdBy) values(?,?,?,?,?,?,?,?,?,?,?)";
    var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProofImage, operationalArea, createdBy]
    executePostOrUpdateQuery(query, requestBody, callback)
}
distributorQueries.updateDistributor = (input, callback) => {
    const { isNewFile, agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProof, operationalArea, distributorId } = input
    let query, requestBody;
    if (isNewFile) {
        query = "update Distributors set agencyName=?,contactPerson=?,mobileNumber=?,alternateNumber=?,address=?,mailId=?,alternateMailId=?,gstNo=?,gstProof=?,operationalArea=? where distributorId=?";
        var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        requestBody = [agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProofImage, operationalArea, distributorId]
    } else {
        query = "update Distributors set agencyName=?,contactPerson=?,mobileNumber=?,alternateNumber=?,address=?,mailId=?,alternateMailId=?,gstNo=?,operationalArea=? where distributorId=?";
        requestBody = [agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, operationalArea, distributorId]
    }
    executePostOrUpdateQuery(query, requestBody, callback)
}
distributorQueries.updateDistributorStatus = (input, callback) => {
    const { distributorId, status } = input
    let query = "update Distributors set isActive=? where distributorId=?";
    let requestBody = [status, distributorId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
distributorQueries.deleteDistributor = (distributorId, callback) => {
    let query = "update Distributors set deleted=? where distributorId=?";
    let requestBody = [1, distributorId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = distributorQueries