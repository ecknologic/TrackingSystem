var fs = require('fs')
const { executeGetQuery, executePostOrUpdateQuery, executeGetParamsQuery } = require('../../utils/functions.js');
let invoiceQueries = {}

invoiceQueries.getInvoices = async (status, callback) => {
    let query = `SELECT i.*,c.Address1 AS billingAddress FROM Invoice i INNER JOIN customerdetails c ON i.customerId=c.customerId ORDER BY invoiceId DESC`;
    return executeGetQuery(query, callback)
}

invoiceQueries.getInvoicesByRole = async (roleId, callback) => {
    let query = `select i.*,c.Address1 AS billingAddress from Invoice i INNER JOIN customerdetails c ON i.customerId=c.customerId INNER JOIN usermaster u ON i.salesPerson=u.userId WHERE u.roleId=?  ORDER BY invoiceId DESC`;
    return executeGetParamsQuery(query, [roleId], callback)
}

invoiceQueries.getInvoicesLogsById = async (invoiceId, callback) => {
    let query = `select l.*,i.createdDateTime as invoiceDate,u.userName,r.RoleName,u1.userName as createdUserName,r1.RoleName as creatorRole from invoicepaymentlogs l INNER JOIN Invoice i ON i.invoiceId=l.invoiceId INNER JOIN usermaster u ON l.userId=u.userId INNER JOIN usermaster u1 ON i.createdBy=u1.userId INNER JOIN rolemaster r ON r.RoleId=u.roleId INNER JOIN rolemaster r1 ON r1.RoleId=u1.roleId WHERE l.invoiceId=?  ORDER BY createdDateTime DESC`;
    return executeGetParamsQuery(query, [invoiceId], callback)
}

invoiceQueries.getDepartmentInvoicesLogsById = async (invoiceId, callback) => {
    let query = `select l.*,i.createdDateTime as invoiceDate,u.userName,r.RoleName,u1.userName as createdUserName,r1.RoleName as creatorRole from departmentInvoicepaymentlogs l INNER JOIN departmentInvoices i ON i.invoiceId=l.invoiceId INNER JOIN usermaster u ON l.userId=u.userId INNER JOIN usermaster u1 ON i.createdBy=u1.userId INNER JOIN rolemaster r ON r.RoleId=u.roleId INNER JOIN rolemaster r1 ON r1.RoleId=u1.roleId WHERE l.invoiceId=?  ORDER BY createdDateTime DESC`;
    return executeGetParamsQuery(query, [invoiceId], callback)
}

invoiceQueries.getCustomerInvoices = async (customerId, callback) => {
    let query = `select i.*,c.Address1 AS billingAddress from Invoice i INNER JOIN customerdetails c ON i.customerId=c.customerId where i.customerId=? ORDER BY invoiceId DESC`;
    return executeGetParamsQuery(query, [customerId], callback)
}

invoiceQueries.getInvoiceByStatus = async (status, callback) => {
    let query = `select i.*,c.Address1 AS billingAddress from Invoice i INNER JOIN customerdetails c ON i.customerId=c.customerId where status=? ORDER BY invoiceId DESC`;
    return executeGetParamsQuery(query, [status], callback)
}

invoiceQueries.getInvoiceByDepartment = async (departmentId, callback) => {
    let query = `select d.*,CASE WHEN d.customerType='distributor' THEN dis.deliveryLocation ELSE c.Address1 END AS billingAddress from departmentInvoices d LEFT JOIN customerdetails c 
    ON d.customerId=c.customerId LEFT JOIN Distributors dis ON
     d.customerId=dis.distributorId where d.departmentId=? ORDER BY updatedDateTime DESC`;

    if (departmentId == "null" || !departmentId) {
        query = `select d.*, dep.departmentName,CASE WHEN d.customerType='distributor' THEN dis.deliveryLocation ELSE c.Address1 END AS billingAddress from departmentInvoices d LEFT JOIN customerdetails c 
        ON d.customerId=c.customerId LEFT JOIN Distributors dis ON
         d.customerId=dis.distributorId INNER JOIN departmentmaster dep ON d.departmentId=dep.departmentId ORDER BY updatedDateTime DESC`;
        return executeGetQuery(query, callback)
    }

    return executeGetParamsQuery(query, [departmentId], callback)
}
invoiceQueries.checkInvoiceStatusByDCNO = (dcNo, callback) => {
    let query = `select * from customerorderdetails where dcNo=? AND isInvoiceGenerated=0`;
    return executeGetParamsQuery(query, [dcNo], callback)
}

invoiceQueries.getInvoiceById = async (input, callback) => {
    const { invoiceId, departmentInvoice } = input
    let query = `select i.*,JSON_ARRAYAGG(json_object('key',p.id,'discount',p.discount,'productName',p.productName,'productPrice',CAST(p.productPrice AS DECIMAL(10,2)),'quantity',p.quantity,'tax',p.tax,'amount',ROUND(p.amount),'cgst',ROUND(p.cgst),'sgst',ROUND(p.sgst),'igst',ROUND(p.igst),'address',p.address,'deliveryAddress',p.deliveryAddress)) as products,c.organizationName, c.gstNo, c.panNo, c.mobileNumber,c.Address1 from Invoice i INNER JOIN invoiceProductsDetails p ON i.invoiceId=p.invoiceId INNER JOIN customerdetails c ON c.customerId=i.customerId where i.invoiceId=? AND p.deleted=0`;
    if (departmentInvoice) query = `SELECT i.*,JSON_ARRAYAGG(JSON_OBJECT('key',p.id,'discount',p.discount,'productName',p.productName,
    'productPrice',CAST(p.productPrice AS DECIMAL(10,2)),'quantity',p.quantity,'tax',p.tax,'amount',
    ROUND(p.amount),'cgst',ROUND(p.cgst),'sgst',ROUND(p.sgst),'igst',ROUND(p.igst),
    'address',p.address,'deliveryAddress',p.deliveryAddress)) AS products,
    CASE WHEN i.customertype='distributor' THEN d.agencyName ELSE c.organizationName  END AS organizationName,
    CASE WHEN i.customertype='distributor' THEN d.gstNo ELSE c.gstNo  END AS gstNo,
    CASE WHEN i.customertype='distributor' THEN '' ELSE c.panNo  END AS panNo,
    CASE WHEN i.customertype='distributor' THEN d.mobileNumber ELSE c.mobileNumber  END AS mobileNumber,
    CASE WHEN i.customertype='distributor' THEN d.address ELSE c.Address1  END AS Address1
    FROM departmentInvoices i INNER JOIN departmentInvoiceProducts p ON i.invoiceId=p.invoiceId
    LEFT JOIN customerdetails c ON c.customerId=i.customerId LEFT JOIN Distributors d ON d.distributorId=i.customerId 
    WHERE i.invoiceId=? AND p.deleted=0`;
    return executeGetParamsQuery(query, [invoiceId], callback)
}

invoiceQueries.getInvoiceId = async (departmentId, callback) => {
    let query = `SELECT (SELECT COALESCE(COUNT(*), 0) FROM Invoice)
    + (SELECT COALESCE(COUNT(*), 0) FROM departmentInvoices) AS invoiceId`
    // if (departmentId) query = "SELECT COUNT(invoiceId) AS invoiceId FROM  departmentInvoices"
    return executeGetQuery(query, callback)
}
invoiceQueries.getInvoicesCount = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = "SELECT COUNT(*) AS totalCount,status FROM Invoice WHERE DATE(`invoiceDate`) <= ? GROUP BY status";
    let options = [endDate]
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) AS totalCount,status FROM Invoice WHERE DATE(`invoiceDate`) >= ? AND DATE(`invoiceDate`) <= ? GROUP BY status";
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

invoiceQueries.getTotalInvoicePendingAmount = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = "SELECT (SELECT COALESCE(SUM(pendingAmount), 0) FROM Invoice WHERE DATE(`invoiceDate`) <= ?) + (SELECT COALESCE(SUM(pendingAmount), 0) FROM departmentInvoices  WHERE DATE(`invoiceDate`) <= ? AND departmentStatus='Pending') + (SELECT COALESCE(SUM(totalAmount), 0) FROM departmentInvoices  WHERE DATE(`invoiceDate`) <= ? AND departmentStatus='Paid' AND status='Pending' ) AS totalPendingAmount";
    let options = [endDate, endDate, endDate]
    if (fromStart !== 'true') {
        query = "SELECT (SELECT COALESCE(SUM(pendingAmount), 0) FROM Invoice WHERE DATE(`invoiceDate`) BETWEEN ? AND ?) + (SELECT COALESCE(SUM(pendingAmount), 0) FROM departmentInvoices WHERE departmentStatus='Pending' AND DATE(`invoiceDate`) BETWEEN ? AND ?) + (SELECT COALESCE(SUM(totalAmount), 0) FROM departmentInvoices  WHERE  departmentStatus='Paid' AND status='Pending' AND DATE(`invoiceDate`) BETWEEN ? AND ? ) AS totalPendingAmount";
        options = [startDate, endDate, startDate, endDate, startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

invoiceQueries.getReceivedInvoiceAmount = async (callback) => {
    let query = `SELECT (SELECT COALESCE(CAST(SUM(totalAmount)AS DECIMAL(10,2)), 0) FROM Invoice WHERE STATUS='Paid')
    + (SELECT COALESCE(CAST(SUM(totalAmount)AS DECIMAL(10,2)), 0) FROM departmentInvoices WHERE STATUS='Paid') AS totalAmount`;
    return executeGetQuery(query, callback)
}

invoiceQueries.getPreviousMonthInvoiceAmount = async (input, callback) => {
    const { startDate, endDate } = input
    let query = `SELECT (SELECT COALESCE(CAST(SUM(totalAmount)AS DECIMAL(10,2)), 0) FROM Invoice WHERE fromdate >=? and toDate<=? AND
     invoiceDate NOT BETWEEN ? AND ?)
    + (SELECT COALESCE(CAST(SUM(totalAmount)AS DECIMAL(10,2)), 0) FROM departmentInvoices WHERE fromdate >=? and toDate<=?)
    +(SELECT COALESCE(CAST(SUM(totalAmount)AS DECIMAL(10,2)), 0) FROM Invoice WHERE invoiceDate Between ? and ?) AS totalAmount`;
    return executeGetParamsQuery(query, [startDate, endDate, startDate, endDate, startDate, endDate, endDate, new Date()], callback)
}

invoiceQueries.getInvoicePayments = async (callback) => {
    // const { startDate, endDate, fromStart } = input
    let query = "SELECT i.*,IFNULL(c.organizationName, c.customerName) as customerName,c.Address1 as billingAddress FROM invoicepaymentlogs i INNER JOIN customerdetails c ON i.customerId=c.customerId ORDER BY createdDateTime DESC";
    // let options = [endDate]
    // if (fromStart && fromStart !== 'true') {
    //     query = "SELECT * FROM invoicepaymentlogs WHERE DATE(`paymentDate`) >= ? AND DATE(`paymentDate`) <= ? ORDER BY createdDateTime DESC";
    //     options = [startDate, endDate]
    // }
    return executeGetQuery(query, callback)
}

invoiceQueries.getDepartmentInvoicePayments = async (departmentId, callback) => {
    let query = "SELECT i.*,IFNULL(c.organizationName, c.customerName) as customerName,c.Address1 as billingAddress FROM departmentInvoicepaymentlogs i INNER JOIN customerdetails c ON i.customerId=c.customerId WHERE i.departmentId=? ORDER BY createdDateTime DESC";
    if (departmentId == 'All') {
        query = "SELECT i.*,IFNULL(c.organizationName, c.customerName) as customerName,c.Address1 as billingAddress FROM departmentInvoicepaymentlogs i INNER JOIN customerdetails c ON i.customerId=c.customerId ORDER BY createdDateTime DESC";
        return executeGetQuery(query, callback)
    }
    return executeGetParamsQuery(query, [departmentId], callback)
}

invoiceQueries.getUnclearedInvoices = async (input, callback) => {
    let { startDate, endDate, fromStart, limit } = input;
    let query = `SELECT i.invoiceId,IFNULL(c.organizationName,c.customerName) AS customerName,c.Address1 AS billingAddress,i.pendingAmount FROM Invoice i
    INNER JOIN customerdetails c ON i.customerId=c.customerId WHERE i.pendingAmount>0 AND DATE(createdDateTime) <=?`
    let options = [endDate]

    if (fromStart !== 'true') {
        query = `SELECT i.invoiceId,IFNULL(c.organizationName,c.customerName) AS customerName,c.Address1 AS billingAddress,i.pendingAmount FROM Invoice i
        INNER JOIN customerdetails c ON i.customerId=c.customerId WHERE i.pendingAmount>0 AND DATE(createdDateTime) BETWEEN ? AND ?`
        options = [startDate, endDate]
    }
    if (limit) {
        query = query + ` LIMIT ${limit}`
    }

    console.log(JSON.stringify(query))
    return executeGetParamsQuery(query, options, callback)
}

invoiceQueries.getUnclearedInvoicesCount = async (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = `SELECT COUNT(*) as totalCount FROM Invoice WHERE pendingAmount>0 AND DATE(createdDateTime) <=?`
    let options = [endDate]

    if (fromStart !== 'true') {
        query = `
        SELECT COUNT(*) as totalCount FROM Invoice WHERE pendingAmount>0 AND DATE(createdDateTime) BETWEEN ? AND ?`
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

invoiceQueries.getUnclearedDepartmentInvoicesCount = async (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = `SELECT COUNT(*) as totalCount FROM departmentInvoices WHERE pendingAmount>0 AND DATE(createdDateTime) <=?`
    let options = [endDate]

    if (fromStart !== 'true') {
        query = `SELECT COUNT(*) as totalCount FROM departmentInvoices WHERE pendingAmount>0 AND DATE(createdDateTime) BETWEEN ? AND ?`
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}


invoiceQueries.getDepartmentInvoicesCount = async (input, callback) => {
    const { startDate, endDate, fromStart, departmentId = 'All' } = input
    let query = "SELECT COUNT(*) AS totalCount,status FROM departmentInvoices WHERE DATE(`invoiceDate`) <= ? GROUP BY status";
    let options = [endDate]
    if (fromStart !== 'true' && departmentId == 'All') {
        query = "SELECT COUNT(*) AS totalCount,status FROM departmentInvoices WHERE DATE(`invoiceDate`) >= ? AND DATE(`invoiceDate`) <= ? GROUP BY status";
        options = [startDate, endDate]
    } else if (fromStart !== 'true' && departmentId != 'All') {
        query = "SELECT COUNT(*) AS totalCount,status FROM departmentInvoices WHERE DATE(`invoiceDate`) >= ? AND DATE(`invoiceDate`) <= ? AND departmentId=? GROUP BY status";
        options = [startDate, endDate, departmentId]
    }
    else if (fromStart == 'true' && departmentId != 'All') {
        query = "SELECT COUNT(*) AS totalCount,status FROM departmentInvoices WHERE departmentId=? GROUP BY status";
        options = [departmentId]
    }
    return executeGetParamsQuery(query, options, callback)
}

//POST Request Methods
invoiceQueries.addInvoicePayment = (input, callback) => {
    const { invoiceId, amountPaid, customerId, paymentDate, paymentMode, userId } = input
    let query = "insert into invoicepaymentlogs (invoiceId,amountPaid, customerId, paymentDate, paymentMode,userId) values(?,?,?,?,?,?)";
    let requestBody = [invoiceId, amountPaid, customerId, paymentDate, paymentMode, userId]
    executePostOrUpdateQuery(query, requestBody, () => {
        let getQuery = 'select i.*,c.Address1 AS billingAddress from Invoice i INNER JOIN customerdetails c ON i.customerId=c.customerId WHERE invoiceId=?'
        return executeGetParamsQuery(getQuery, [invoiceId], callback)
    })
}

invoiceQueries.addDepartmentInvoicePayment = (input, callback) => {
    const { invoiceId, amountPaid, customerId, customerType, paymentDate, paymentMode, departmentId, userId } = input
    let query = "insert into departmentInvoicepaymentlogs (invoiceId,amountPaid,customerId, customerType, paymentDate, paymentMode,departmentId,userId) values(?,?,?,?,?,?,?,?)";
    let requestBody = [invoiceId, amountPaid, customerId, customerType, paymentDate, paymentMode, departmentId, userId]
    executePostOrUpdateQuery(query, requestBody, () => {
        let getQuery = `select d.*, dep.departmentName,CASE WHEN d.customerType='distributor' THEN dis.deliveryLocation ELSE c.Address1 END AS billingAddress from departmentInvoices d LEFT JOIN customerdetails c 
        ON d.customerId=c.customerId LEFT JOIN Distributors dis ON
         d.customerId=dis.distributorId INNER JOIN departmentmaster dep ON d.departmentId=dep.departmentId where invoiceId=?`
        return executeGetParamsQuery(getQuery, [invoiceId], callback)
    })
}

invoiceQueries.createInvoice = (input, callback) => {
    const { customerId, invoiceDate, dueDate, fromDate, toDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName, mailIds, createdBy } = input
    let query = "insert into Invoice (customerId,invoiceDate,dueDate,salesPerson,invoiceId,hsnCode,poNo,totalAmount,pendingAmount,customerName,fromDate,toDate,mailIds,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [customerId, invoiceDate, dueDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, totalAmount, customerName, fromDate, toDate, mailIds, createdBy]
    executePostOrUpdateQuery(query, requestBody, callback)
}

invoiceQueries.createDepartmentInvoice = (input, callback) => {
    const { dcNo, customerId, invoiceDate, dueDate, fromDate, toDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName, departmentId, mailIds, departmentStatus = 'Pending', customerType = 'customer', paymentMode, createdBy } = input
    const pendingAmount = departmentStatus == "Pending" ? totalAmount : 0
    const noOfPayments = departmentStatus != "Pending" ? 1 : 0
    const status = "Pending"
    let query = "insert into departmentInvoices (dcNo,customerId,invoiceDate,dueDate,salesPerson,invoiceId,hsnCode,poNo,totalAmount,customerName,fromDate,toDate,departmentId,status,mailIds,departmentStatus,pendingAmount,customerType,paymentMode,noOfPayments,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    // var gstProofImage = Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [dcNo, customerId, invoiceDate, dueDate, salesPerson, invoiceId, hsnCode, poNo, totalAmount, customerName, fromDate, toDate, departmentId, status, mailIds, departmentStatus, pendingAmount, customerType, paymentMode, noOfPayments, createdBy]
    executePostOrUpdateQuery(query, requestBody, callback)
}

invoiceQueries.saveDepartmentInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    // console.log("prr", JSON.stringify(products))
    const sql = products.map(item => "('" + invoiceId + "', '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ", " + item.amount + ",'" + item.address + "','" + item.deliveryAddress + "')")
    let query = "insert into departmentInvoiceProducts (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount,address,deliveryAddress) values " + sql;
    executeGetQuery(query, callback)
}

invoiceQueries.saveInvoiceProducts = (input, callback) => {
    const { invoiceId, products } = input
    // console.log("prr", JSON.stringify(products))
    const sql = products.map(item => "('" + invoiceId + "', '" + item.productName + "', " + item.productPrice + ", " + item.discount + ", " + item.quantity + ", " + item.tax + ", " + item.cgst + ", " + item.sgst + ", " + item.igst + ", " + item.amount + ",'" + item.address + "','" + item.deliveryAddress + "')")
    let query = "insert into invoiceProductsDetails (invoiceId, productName, productPrice, discount, quantity, tax,cgst,sgst,igst,amount,address,deliveryAddress) values " + sql;
    executeGetQuery(query, callback)
}

invoiceQueries.saveInvoicePdf = (input, callback) => {
    const { invoiceId } = input
    let query = "update Invoice set invoicePdf=? where invoiceId='" + invoiceId + "'"
    fs.readFile("invoice.pdf", (err, result) => {
        executePostOrUpdateQuery(query, [result], callback)
    })
}

invoiceQueries.updateDCInvoiceFlag = (dcNo, callback) => {
    let query = "update customerorderdetails set isInvoiceGenerated=? where dcNo='" + dcNo + "'"
    executePostOrUpdateQuery(query, [1], callback)
}

invoiceQueries.updateMultipleDcsInvoiceFlag = (input, callback) => {
    const { fromDate, toDate, customerId } = input
    let query = "update customerorderdetails set isInvoiceGenerated=? where existingCustomerId=? AND DATE(deliveredDate) BETWEEN ? AND ?"
    executePostOrUpdateQuery(query, [1, customerId, fromDate, toDate], callback)
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
invoiceQueries.updateDepartmentInvoiceStatus = (input, callback) => {
    const { invoiceId, departmentStatus, status } = input
    let query = "update departmentInvoices SET updatedDateTime=?,departmentStatus=?, status=? WHERE invoiceId=?";
    executePostOrUpdateQuery(query, [new Date(), departmentStatus, status, invoiceId], callback)
}

invoiceQueries.updateInvoicePaymentDetails = (input, callback) => {
    const { invoiceId, noOfPayments, pendingAmount } = input
    let status = pendingAmount == 0 ? 'Paid' : 'Pending'
    let query = "update Invoice SET updatedDateTime=?,noOfPayments=?, pendingAmount=?,status=? WHERE invoiceId=?";
    executePostOrUpdateQuery(query, [new Date(), noOfPayments, pendingAmount, status, invoiceId], callback)
}

invoiceQueries.updateDepartmentInvoicePaymentDetails = (input, callback) => {
    const { invoiceId, noOfPayments, pendingAmount } = input
    let status = pendingAmount == 0 ? 'Paid' : 'Pending'
    let query = "update departmentInvoices SET updatedDateTime=?,noOfPayments=?, pendingAmount=?,status=? WHERE invoiceId=?";
    executePostOrUpdateQuery(query, [new Date(), noOfPayments, pendingAmount, status, invoiceId], callback)
}

module.exports = invoiceQueries