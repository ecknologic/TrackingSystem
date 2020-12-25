const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let warehouseQueries = {}


//POST Request Methods
warehouseQueries.saveWarehouseStockDetails = (input, callback) => {
    let query = "insert into warehousestockdetails (warehouseId,20LCans,1LBoxes,500MLBoxes,250MLBoxes,damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,deliveryDate,isConfirmed) values(?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.departmentId, input.total20LCans, input.total1LBoxes, input.total500MLBoxes, input.total250MLBoxes, input.damaged20LCans, input.damaged1LBoxes, input.damaged500MLBoxes, input.damaged250MLBoxes, input.deliveryDate, '1']
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.insertReturnStockDetails = (input, callback) => {
    let query = "insert into returnstockdetails (damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,damagedDesc,departmentId,motherplantId) values(?,?,?,?,?,?,?)";
    let requestBody = [input.damaged20LCans, input.damaged1LBoxes, input.damaged500MLBoxes, input.damaged250MLBoxes, input.damagedDesc, input.departmentId, input.motherplantId]
    executePostOrUpdateQuery(query, requestBody, callback)
}


//Update Request Methods
warehouseQueries.confirmDispatchDetails = (input, callback) => {
    let query = "update dispatches set returnStockId=?,isConfirmed=? where DCNO=?";
    let requestBody = [input.returnStockId ? input.returnStockId : '0', 1, input.dcNo];
    executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = warehouseQueries