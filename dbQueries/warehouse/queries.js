const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let warehouseQueries = {}


//POST Request Methods
warehouseQueries.saveWarehouseStockDetails = (input, callback) => {
    const { isDamaged, departmentId, total20LCans, total1LBoxes, total250MLBoxes, total500MLBoxes, damaged500MLBoxes, damaged250MLBoxes, damaged20LCans, damaged1LBoxes, deliveryDate } = input
    let query = "insert into warehousestockdetails (warehouseId,20LCans,1LBoxes,500MLBoxes,250MLBoxes,damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,deliveryDate,isConfirmed) values(?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [departmentId, total20LCans, total1LBoxes, total500MLBoxes, total250MLBoxes, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, deliveryDate, '1']

    if (isDamaged) requestBody = [departmentId, total20LCans - damaged20LCans, total1LBoxes - damaged1LBoxes, total500MLBoxes - damaged500MLBoxes, total250MLBoxes - damaged250MLBoxes, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, deliveryDate, '1']
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.insertReturnStockDetails = (input, callback) => {
    let query = "insert into returnstockdetails (damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,damagedDesc,departmentId,motherplantId) values(?,?,?,?,?,?,?)";
    let requestBody = [input.damaged20LCans, input.damaged1LBoxes, input.damaged500MLBoxes, input.damaged250MLBoxes, input.damagedDesc, input.departmentId, input.motherplantId]
    executePostOrUpdateQuery(query, requestBody, callback)
}


//Update Request Methods
warehouseQueries.confirmDispatchDetails = (input, callback) => {
    let query = "update dispatches set returnStockId=?,isConfirmed=?,status=? where DCNO=?";
    let requestBody = [input.returnStockId ? input.returnStockId : '0', 1, 'Delivered', input.dcNo];
    executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = warehouseQueries