const { executeGetQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let distributorQueries = {}

distributorQueries.getDistributors = async (callback) => {
    let query = `select * from Distributors ORDER BY createdDateTime DESC`;
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
    const { agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProof, operationalArea, createdBy, distributorId } = input
    let query = "update Distributors agencyName=?,contactPerson=?,mobileNumber=?,alternateNumber=?,address=?,mailId=?,alternateMailId=?,gstNo=?,gstProof=?,operationalArea=?,createdBy=? where distributorId=?";
    var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProofImage, operationalArea, createdBy, distributorId]
    executePostOrUpdateQuery(query, requestBody, () => {
        return distributorQueries.getDistributorById(distributorId, callback)
    })
}
module.exports = distributorQueries