const dayjs = require('dayjs');
var express = require('express');
var router = express.Router();
const db = require('../config/db.js');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const customerQueries = require('../dbQueries/Customer/queries.js');
const departmenttransactionQueries = require('../dbQueries/departmenttransactions/queries.js');
const motherPlantDbQueries = require('../dbQueries/motherplant/queries.js');
const stockRequestQueries = require('../dbQueries/stockrequests/queries.js');
const usersQueries = require('../dbQueries/users/queries.js');
const warehouseQueries = require('../dbQueries/warehouse/queries.js');
const { DATEFORMAT, INSERTMESSAGE, UPDATEMESSAGE, WEEKDAYS, constants } = require('../utils/constants.js');
const { customerProductDetails, dbError, getCompareData, getFormatedNumber, getGraphData, getCompareCustomersData } = require('../utils/functions.js');
const { compareDCDataByRoute, compareOrdersDataByRoute } = require('./utils/customer.js');
const { compareDepartmentData } = require('./utils/department.js');
var departmentId, adminUserId, userName, userRole;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  departmentId = req.headers['departmentid']
  adminUserId = req.headers['userid']
  userName = req.headers['username']
  userRole = req.headers['userrole']
  console.log('Time: ', Date.now());
  next();
});


router.get('/getroutes', (req, res) => {
  let query = "select r.*,d.departmentName from routes r INNER JOIN departmentmaster d ON r.departmentId=d.departmentId WHERE r.deleted='0' ORDER BY r.createdDateTime DESC";
  db.query(query, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});

router.post('/createRoute', (req, res) => {
  let input = req.body;
  warehouseQueries.createRoute(input, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else
      res.json(INSERTMESSAGE);
  });
})
router.post('/updateRoute', (req, res) => {
  let input = req.body;
  warehouseQueries.updateRoute(input, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else
      res.json(UPDATEMESSAGE);
  });
})


router.get('/getdriverDetails/:warehouseId', (req, res) => {
  let warehouseId = req.params.warehouseId;
  let query = "select * from driverdetails where departmentId=" + warehouseId;
  db.query(query, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});

router.get('/getNewStockDetails/:id', (req, res) => {
  let input = {
    date: dayjs(req.query.date).format('YYYY-MM-DD'),
    departmentId: req.params.id
  }
  motherPlantDbQueries.getCurrentDispatchDetailsByDate(input, (err, results) => {
    if (err) res.json(dbError(err));
    else {
      res.json(results.length ? results[0] : {});
    }
  });
});

router.get('/getDispatchDetailsByDC/:DCNO', (req, res) => {
  motherPlantDbQueries.getDispatchDetailsByDC(req.params.DCNO, (err, results) => {
    if (err) res.json(dbError(err));
    else {
      res.json(results.length ? results[0] : {});
    }
  });
});
router.get('/getOrderDetailsByDepartment/:departmentId', (req, res) => {
  warehouseQueries.getOrderDetailsByDepartment(req.params.departmentId, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results);
  });
});

router.get('/getWarehouseList', (req, res) => {
  warehouseQueries.getWarehouseList((err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results);
  });
});
router.get('/getWarehouseById/:warehouseId', (req, res) => {
  warehouseQueries.getWarehouseById(req.params.warehouseId, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results);
  });
});
router.post('/createWarehouse', (req, res) => {
  warehouseQueries.createWarehouse(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      usersQueries.updateUserDepartment({ departmentId: results.insertId, userId: req.body.adminId }, (err, userresults) => {
        if (err) res.status(500).json(dbError(err));
        else {
          auditQueries.createLog({ userId: adminUserId, description: `Warehouse Created by ${userRole} <b>(${userName})</b>`, departmentId: results.insertId, type: 'warehouse' })
          res.json(results);
        }
      })
    }
  });
});
router.post('/updateWarehouse', async (req, res) => {
  const { departmentId, adminId: userId, removedAdminId, address, departmentName, city, state, pinCode, adminId, phoneNumber, gstNo, adminName } = req.body
  let data = {
    address, departmentName, city, state, pinCode, adminId, phoneNumber, gstNo, adminName
  }
  const logs = await compareDepartmentData(data, { type: 'warehouse', departmentId, adminUserId, userRole, userName })
  warehouseQueries.updateWarehouse(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      usersQueries.updateUserDepartment({ departmentId, userId, removedAdminId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
          if (logs.length) {
            auditQueries.createLog(logs, (err, data) => {
              if (err) console.log('log error', err)
              else console.log('log data', data)
            })
          }
          res.json(results);
        }
      })
    }
  });
});

router.post('/createDC', (req, res) => {
  let { EmailId, phoneNumber, customerType } = req.body;
  if (customerType == 'newCustomer') {
    customerQueries.checkCustomerExistsOrNot({ EmailId, mobileNumber: phoneNumber }, (err, results) => {
      if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
      else if (results.length) {
        // req.body.existingCustomerId = results[0].customerId
        // req.body.customerType = 'internal'
        // saveDC(req, res)
        res.status(405).json('User already exists.')
      } else {
        customerQueries.createAdhocUser({ ...req.body, customertype: 'Individual' }, (err, data) => {
          if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
          else {
            console.log("data", data)
            req.body.existingCustomerId = data.insertId
            auditQueries.createLog({ userId: adminUserId, description: `Customer created by ${userRole} <b>(${userName})</b>`, customerId: data.insertId, type: "customer" })
            saveDC(req, res)
          }
        })
      }
    })
  } else saveDC(req, res)
});

router.put('/updateDC', (req, res) => {
  let dcCreateQuery = "UPDATE customerorderdetails SET customerName=?,phoneNumber=?,address=?,routeId=?,driverId=?,20LCans=?,1LBoxes=?,500MLBoxes=?,300MLBoxes=?,2LBoxes=?,warehouseId=? WHERE customerOrderId=?";
  let dcDetails = req.body;
  let updateQueryValues = [dcDetails.customerName, dcDetails.phoneNumber, dcDetails.address, dcDetails.routeId, dcDetails.driverId, dcDetails.product20L, dcDetails.product1L, dcDetails.product500ML, dcDetails.product300ML, dcDetails.product2L, dcDetails.warehouseId, dcDetails.customerOrderId]
  db.query(dcCreateQuery, updateQueryValues, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      let deliveryDetailsQuery = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid   WHERE customerOrderId =?";
      db.query(deliveryDetailsQuery, [dcDetails.customerOrderId], (deliveryErr, deliveryDetails) => {
        if (deliveryErr) res.json({ status: 500, message: deliveryErr.sqlMessage });
        else res.json({ status: 200, message: "DC Updated successfully", data: deliveryDetails })
      })
    }
  });
})

router.put('/assignDriverForDcs', async (req, res) => {
  const { selectedDate, driverName, routeId } = req.body
  let logs;

  if (selectedDate != undefined && selectedDate != null) {
    logs = await compareDCDataByRoute({ driverName, routeId, selectedDate }, { departmentId, userId: adminUserId, userRole, userName })
  } else {
    logs = await compareOrdersDataByRoute({ driverName, routeId, departmentId }, { userId: adminUserId, userRole, userName })
  }

  warehouseQueries.assignDriversForMultipleDcs(req.body, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      if (logs.length && selectedDate != undefined && selectedDate != null) {
        departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
          if (err) console.log('log error', err)
          else console.log('log data', data)
        })
      } else if (logs.length) {
        departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
          if (err) console.log('log error', err)
          else console.log('log data', data)
        })
      }
      res.json(UPDATEMESSAGE)
    }
  });
})

router.post('/confirmStockRecieved', (req, res) => {
  let input = req.body;
  input.departmentId = departmentId
  if (input.isDamaged) {
    warehouseQueries.insertReturnStockDetails(input, (err, results) => {
      if (err) res.status(500).json(err.sqlMessage);
      else {
        let obj = {
          returnStockId: results.insertId,
          dcNo: input.dcNo
        }
        warehouseQueries.confirmDispatchDetails(obj, (confirmErr, results1) => {
          if (confirmErr) res.status(500).json(dbError(confirmErr));
          else res.json(INSERTMESSAGE)
        });
      }
    });
  } else {
    warehouseQueries.confirmDispatchDetails(input, (confirmErr, results1) => {
      if (confirmErr) res.status(500).json(dbError(confirmErr));
      else res.json(INSERTMESSAGE)
    });
  }

  input.deliveryDate = new Date()
  warehouseQueries.saveWarehouseStockDetails(input, (err, warehouseData) => {
    if (err) res.status(500).json(dbError(err))
  })
});


router.get('/deliveryDetails/:date', (req, res) => {
  var date = req.params.date;
  warehouseQueries.getDeliveryDetails({ date, departmentId }, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});

router.get('/deliveryDetailsByDriver/:date', (req, res) => {
  var date = req.params.date;
  warehouseQueries.getTotalDeliveryDetailsByDriver({ date, departmentId }, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    else if (!results.length) res.send(JSON.stringify(results));
    else {
      let result = results[0]
      let obj = {
        driverName: result.driverName,
        mobileNumber: result.mobileNumber,
        routeName: result.routeName,
        driverId: result.driverId
      }
      obj.stockDetails = result
      warehouseQueries.getDeliveredDeliveryDetailsByDriver({ date, departmentId }, (err, deliveredData) => {
        if (err) res.status(500).json(err.sqlMessage);
        else {
          obj.deliveredDetails = deliveredData.length ? deliveredData[0] : {};
          warehouseQueries.getPendingDeliveryDetailsByDriver({ date, departmentId }, (err, pendingData) => {
            if (err) res.status(500).json(err.sqlMessage);
            else {
              obj.pendingDetails = pendingData.length ? pendingData[0] : {};
              res.send(JSON.stringify([obj]));
            }
          })
        }
      })
    }
  });
});

router.get('/getAllDcDetails', (req, res) => {
  warehouseQueries.getAllDcDetails(req.query, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});


router.get('/getTotalReturnCans/:date', (req, res) => {
  warehouseQueries.getTotalWarehouseReturnCans({ departmentId, date: req.params.date }, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results[0]);
  });
});

router.get('/getTotalSales', (req, res) => {
  var input = req.query;
  const defaultValues = { product20LCount: 0, product1LCount: 0, product500MLCount: 0, product300MLCount: 0, product2LCount: 0 }
  warehouseQueries.getTotalSales(input, (err, result) => {
    if (err) res.status(500).json(err.sqlMessage);
    else if (result.length) {
      const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = result[0]
      const data = {
        product20LCount: getFormatedNumber(p20L),
        product1LCount: getFormatedNumber(p1L), product500MLCount: getFormatedNumber(p500ml),
        product300MLCount: getFormatedNumber(p300ml),
        product2LCount: getFormatedNumber(p2l)
      }
      if (input.type == "This Week") {
        let graph = [], product20LCount = 0, product2LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0;
        WEEKDAYS.map((day) => {
          const index = result.findIndex((item) => WEEKDAYS[dayjs(item.deliveredDate).day()] === day)
          if (index >= 0) {
            const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = result[index]
            graph = [...graph, ...getGraphData(p20L, p2l, p1L, p500ml, p300ml, day)]
          }
          else graph = [...graph, ...getGraphData(0, 0, 0, 0, 0, day)]
        })
        result.map(product => {
          const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = product
          product20LCount += p20L
          product1LCount += p1L
          product500MLCount += p500ml
          product300MLCount += p300ml
          product2LCount += p2l
        })
        res.json({ product20LCount: getFormatedNumber(product20LCount), product2LCount: getFormatedNumber(product2LCount), product1LCount: getFormatedNumber(product1LCount), product500MLCount: getFormatedNumber(product500MLCount), product300MLCount: getFormatedNumber(product300MLCount), graph })
      } else {
        data.graph = getGraphData(p20L, p2l, p1L, p500ml, p300ml)
        res.json(data);
      }
    }
    else {
      if (input.type == "This Week") {
        let graph = []
        WEEKDAYS.map((day) => {
          graph = [...graph, ...getGraphData(0, 0, 0, 0, 0, day)]
        })
        res.json({ ...defaultValues, graph })
      }
      else res.json({ ...defaultValues, graph: getGraphData(0, 0, 0, 0, 0) })
    }
  });
});

router.get('/currentActiveStockDetails/:date', (req, res) => {
  let deliveryDate = req.params.date;
  let { warehouseId } = req.query;
  let currentActiveStockQuery = `CALL warehouse_CurrentActiveStock(?,?)`;
  // let currentActiveStockQuery = "SELECT (`a`.`total20LCans` - IFNULL(`b`.`total20LCans`,0)) AS `total20LCans`, (`a`.`total1LBoxes` - IFNULL(`b`.`total1LBoxes`,0)) AS `total1LBoxes`, (`a`.`total500MLBoxes` - IFNULL(`b`.`total500MLBoxes`,0)) AS `total500MLBoxes`, (`a`.`total300MLBoxes` - IFNULL(`b`.`total300MLBoxes`,0)) AS `total300MLBoxes`,(`a`.`total2LBoxes` - IFNULL(`b`.`total2LBoxes`,0)) AS `total2LBoxes` FROM (SELECT  SUM(20LCans) AS `total20LCans`,SUM(1LBoxes) AS `total1LBoxes`, SUM(500MLBoxes) AS `total500MLBoxes`,SUM(300MLBoxes) AS `total300MLBoxes`,SUM(2LBoxes) AS `total2LBoxes` FROM `warehousestockdetails` WHERE warehouseId=? AND DATE(DeliveryDate)<=?) AS a INNER JOIN (SELECT  SUM(20LCans) AS `total20LCans`, SUM(1LBoxes) AS `total1LBoxes`,  SUM(500MLBoxes) AS `total500MLBoxes`, SUM(300MLBoxes) AS `total300MLBoxes`, SUM(2LBoxes) AS `total2LBoxes`  FROM  customerorderdetails WHERE  isDelivered='Completed' AND warehouseId=? AND DATE(DeliveryDate)<=?) AS b"
  db.query(currentActiveStockQuery, [warehouseId, deliveryDate], (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results[0][0]);
  });
});

router.get('/totalCurrentActiveStockDetails', (req, res) => {
  // let currentActiveStockQuery = "SELECT (`a`.`total20LCans` - IFNULL(`b`.`total20LCans`,0)) AS `total20LCans`, (`a`.`total1LBoxes` - IFNULL(`b`.`total1LBoxes`,0)) AS `total1LBoxes`, (`a`.`total500MLBoxes` - IFNULL(`b`.`total500MLBoxes`,0)) AS `total500MLBoxes`, (`a`.`total300MLBoxes` - IFNULL(`b`.`total300MLBoxes`,0)) AS `total300MLBoxes`,(`a`.`total2LBoxes` - IFNULL(`b`.`total2LBoxes`,0)) AS `total2LBoxes` FROM (SELECT  SUM(20LCans) AS `total20LCans`,SUM(1LBoxes) AS `total1LBoxes`, SUM(500MLBoxes) AS `total500MLBoxes`,SUM(300MLBoxes) AS `total300MLBoxes`,SUM(2LBoxes) AS `total2LBoxes` FROM `warehousestockdetails` WHERE warehouseId=? AND DATE(DeliveryDate)<=?) AS a INNER JOIN (SELECT  SUM(20LCans) AS `total20LCans`, SUM(1LBoxes) AS `total1LBoxes`,  SUM(500MLBoxes) AS `total500MLBoxes`, SUM(300MLBoxes) AS `total300MLBoxes`, SUM(2LBoxes) AS `total2LBoxes`  FROM  customerorderdetails WHERE  isDelivered='Completed' AND warehouseId=? AND DATE(DeliveryDate)<=?) AS b"
  // warehouseQueries.getTotalCurrentActiveStocks({ ...req.query, departmentId }, (err, results) => {
  //   if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
  //   else res.json(results[0]);
  // });
  let { startDate } = req.query;

  let currentActiveStockQuery = `CALL warehouse_CurrentActiveStock(?,?)`;
  // let currentActiveStockQuery = "SELECT (`a`.`total20LCans` - IFNULL(`b`.`total20LCans`,0)) AS `total20LCans`, (`a`.`total1LBoxes` - IFNULL(`b`.`total1LBoxes`,0)) AS `total1LBoxes`, (`a`.`total500MLBoxes` - IFNULL(`b`.`total500MLBoxes`,0)) AS `total500MLBoxes`, (`a`.`total300MLBoxes` - IFNULL(`b`.`total300MLBoxes`,0)) AS `total300MLBoxes`,(`a`.`total2LBoxes` - IFNULL(`b`.`total2LBoxes`,0)) AS `total2LBoxes` FROM (SELECT  SUM(20LCans) AS `total20LCans`,SUM(1LBoxes) AS `total1LBoxes`, SUM(500MLBoxes) AS `total500MLBoxes`,SUM(300MLBoxes) AS `total300MLBoxes`,SUM(2LBoxes) AS `total2LBoxes` FROM `warehousestockdetails` WHERE warehouseId=? AND DATE(DeliveryDate)<=?) AS a INNER JOIN (SELECT  SUM(20LCans) AS `total20LCans`, SUM(1LBoxes) AS `total1LBoxes`,  SUM(500MLBoxes) AS `total500MLBoxes`, SUM(300MLBoxes) AS `total300MLBoxes`, SUM(2LBoxes) AS `total2LBoxes`  FROM  customerorderdetails WHERE  isDelivered='Completed' AND warehouseId=? AND DATE(DeliveryDate)<=?) AS b"
  db.query(currentActiveStockQuery, [departmentId, startDate], (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      res.json(results[0][0]);
    }
  });
});

router.get('/outForDeliveryDetails/:date', (req, res) => {
  var date = req.params.date, { warehouseId } = req.query;
  let outForDeliveryDetailsQuery = "SELECT SUM(c.20LCans) AS total20LCans,SUM(c.1LBoxes) AS total1LBoxes,SUM(c.500MLBoxes) total500MLBoxes,SUM(c.300MLBoxes) total300MLBoxes,SUM(c.2LBoxes) total2LBoxes FROM customerorderdetails c WHERE warehouseId=? and DATE(`deliveryDate`)='" + date + "'";
  db.query(outForDeliveryDetailsQuery, [warehouseId], (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else res.json(results[0]);
  });
});
router.get('/getWarehouseDetails/:warehouseId', (req, res) => {
  let { warehouseId } = req.params;
  let warehouseQuery = "SELECT * FROM departmentmaster WHERE DepartmentId=" + warehouseId;
  db.query(warehouseQuery, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: 'Success', data: results.length ? results[0] : results });
  });
});

router.get('/getConfirmedEmptyCans/:date', (req, res) => {
  warehouseQueries.getConfirmedEmptyCans(departmentId, req.params.date, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results[0]);
  });
});
router.get('/getReturnedEmptyCans/:date', (req, res) => {
  warehouseQueries.getReturnedEmptyCansToMotherPlant({ departmentId, date: req.params.date }, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results[0]);
  });
});
router.post('/returnEmptyCans', (req, res) => {
  const { emptycans_count = 0, motherplantId } = req.body
  warehouseQueries.returnEmptyCansToMotherplant(req.body, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      res.json(results);
      motherPlantDbQueries.updateRMDetailsEmptyCansCount({ emptycans_count, motherplantId }, (updateerr, results) => {
        if (updateerr) res.status(500).json({ status: 500, message: updateerr.sqlMessage });
      })
    }
  });
});
router.put('/updateReturnEmptyCans', (req, res) => {
  warehouseQueries.updateMotherplantReturnEmptyCans(req.body, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  });
});
router.put('/updateDepartmentStatus', (req, res) => {
  const { status, departmentId, departmentType } = req.body
  warehouseQueries.updateDepartmentStatus(req.body, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      auditQueries.createLog({ userId: adminUserId, description: `${departmentType} status changed to ${status == 1 ? "Active" : "Inactive"} by ${userRole} <b>(${userName})</b>`, departmentId, type: departmentType })
      res.json(results);
    }
  });
});
router.delete('/deleteDepartment/:departmentId', (req, res) => {
  const { departmentId } = req.params
  const { departmentType } = req.query
  warehouseQueries.deleteDepartment(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      auditQueries.createLog({ userId: adminUserId, description: `${departmentType} deleted by ${userRole} <b>(${userName})</b>`, departmentId, type: departmentType })
      res.json(results);
    }
  });
});
router.delete('/deleteRoute/:RouteId', (req, res) => {
  warehouseQueries.deleteRoute(req.params.RouteId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  });
});
router.post('/updateUserDepartment', (req, res) => {
  const { departmentId, userId } = req.body;
  usersQueries.updateUserDepartment({ departmentId, userId }, (err, userResults) => {
    if (err) res.status(500).json(dbError(err));
    else {
      res.json(userResults);
    }
  })
});

router.get("/getOrders", (req, res) => {
  customerQueries.getOrdersByDepartmentId(departmentId, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else if (results.length) {
      let arr = [], count = 0;
      for (let result of results) {
        customerProductDetails(result.deliveryDetailsId).then(response => {
          count++
          if (err) console.log(err);
          else {
            result["products"] = response;
            arr.push(result)
          }
          if (count == results.length) {
            let sortedData = arr.sort((a, b) => b.registeredDate - a.registeredDate)
            res.json(sortedData);
          }
        });
      }
    }
    else {
      res.json(results)
    }
  })
});
router.get('/getEmptyCansList', (req, res) => {
  warehouseQueries.getEmptyCansList(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getTotalEmptyCansCount', (req, res) => {
  const { type } = req.query
  const input = { departmentId, ...req.query }
  warehouseQueries.getTotalEmptyCansCount(input, (err, currentValues) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      warehouseQueries.getTotalEmptyCansChangeCount(input, (err, previousValues) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          res.json({ ...currentValues[0], ...getCompareData(currentValues[0], previousValues[0], type) });
        }
      })
    }
  })
})
router.get('/getReceivedStock', (req, res) => {
  warehouseQueries.getReceivedStock(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getDCList', (req, res) => {
  warehouseQueries.getDCList(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getDcDetailsByDcNo/:dcNo', (req, res) => {
  warehouseQueries.getDcDetailsByDcNo(req.params.dcNo, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getReceivedStockById/:id', (req, res) => {
  warehouseQueries.getReceivedStockById({ id: req.params.id }, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getDamagedStock', (req, res) => {
  warehouseQueries.getDamagedStock(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})
router.get('/getDepartmentStaff', (req, res) => {
  warehouseQueries.getDepartmentStaff(departmentId, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results);
  })
})

router.get('/getCustomersCount', (req, res) => {
  const result = {}
  const { type } = req.query
  let input = req.query
  input.departmentId = departmentId
  customerQueries.getTotalCustomersByDepartment(input, (err, active) => {
    if (err) res.status(500).json(dbError(err))
    else {
      result.totalCustomers = active.length ? active[0].totalCount : 0
      customerQueries.getCorporateCustomersByDepartment(input, (err, corporate) => {
        if (err) res.status(500).json(dbError(err))
        else {
          result.activeCorporateCustomers = corporate.length ? corporate[0].totalCount : 0
          customerQueries.getCorporateCustomersChangeByDepartment(input, (err, previousCorporate) => {
            if (err) res.status(500).json(dbError(err))
            else {
              result.prevActiveCorporateCustomers = previousCorporate.length ? previousCorporate[0].totalCount : 0
            }
          })
          customerQueries.getInActiveCustomersByDepartment(input, (err, inactive) => {
            if (err) res.status(500).json(dbError(err))
            else {
              result.inActiveCustomers = inactive.length ? inactive[0].totalCount : 0
            }
          })
          customerQueries.getOtherCustomersByDepartment(input, (err, other) => {
            if (err) res.status(500).json(dbError(err))
            else {
              result.activeOtherCustomers = other.length ? other[0].totalCount : 0
              customerQueries.getOtherCustomersChangeByDepartment(input, (err, previousOther) => {
                if (err) res.status(500).json(dbError(err))
                else if (previousOther.length) {
                  result.prevActiveOtherCustomers = previousOther.length ? previousOther[0].totalCount : 0
                  res.json(getCompareCustomersData(result, type))
                }
                else res.json(getCompareCustomersData(result, type))
              })
            }
          })
        }
      })
    }
  })
})


router.get('/getDCDetailsByCOId/:COId', (req, res) => {
  warehouseQueries.getDeliverysByCustomerOrderId(req.params.COId, (deliveryErr, deliveryDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else res.json(deliveryDetails)
  })
})

router.put('/rescheduleDc', (req, res) => {
  const { customerOrderId, date, existingCustomerId, address } = req.body
  warehouseQueries.checkDcSchedule(req.body, (deliveryErr, deliveryDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else if (!deliveryDetails.length) {
      customerQueries.getCustomerDeliveryDays({ existingCustomerId, departmentId, address }, (err, deliverydata) => {
        if (err) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
        else if (!deliverydata.length) res.status(404).send('Customer is closed or not found')
        else {
          var day = constants.days[new Date(date).getDay()].toUpperCase();
          if (deliverydata[0][day] == 1) res.status(405).send('DC Already exists')
          else {
            warehouseQueries.rescheduleDC(req.body, (deliveryErr, rescheduled) => {
              if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
              else {
                departmenttransactionQueries.createDepartmentTransaction({ userId: adminUserId, description: `DC  Rescheduled by ${userRole} <b>(${userName})</b>`, transactionId: customerOrderId, departmentId, type: 'warehouse', subType: 'delivery' })
                res.json('Rescheduled successfully')
              }
            })
          }
        }
      })

    } else {
      res.status(405).send('DC Already exists')
    }
  })
})
router.put('/closeDC', (req, res) => {
  const { customerOrderId } = req.body
  warehouseQueries.closeDC(req.body, (deliveryErr, closedDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else {
      departmenttransactionQueries.createDepartmentTransaction({ userId: adminUserId, description: `DC  Cancelled by ${userRole} <b>(${userName})</b>`, transactionId: customerOrderId, departmentId, type: 'warehouse', subType: 'delivery' })
      res.json(closedDetails)
    }
  })
})

router.post('/requestStock', (req, res) => {
  const { products } = req.body
  if (products.length) {
    stockRequestQueries.requestStock({ ...req.body, departmentId }, (requestErr, requestDetails) => {
      if (requestErr) res.status(500).json({ status: 500, message: requestErr.sqlMessage });
      else {
        const requestId = requestDetails.insertId
        stockRequestQueries.saveRequestedStockDetails({ products, requestId, departmentId }, (err, results) => {
          if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
          else {
            departmenttransactionQueries.createDepartmentTransaction({ userId: adminUserId, description: `Stock requested by ${userRole} <b>(${userName})</b>`, transactionId: requestId, departmentId, type: 'warehouse', subType: 'stockRequest' })
            res.json(requestDetails)
          }
        })
      }
    })
  }
  else res.status(400).send('Bad request')
})

router.get('/getRequestedStock', (req, res) => {
  stockRequestQueries.getDepartmentStockRequests({ departmentId, userRole }, (deliveryErr, requestDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else {
      res.json(requestDetails)
    }
  })
})

router.get('/getRequestedStockById/:requestId', (req, res) => {
  stockRequestQueries.getDepartmentStockRequestById({ requestId: req.params.requestId, departmentId }, (deliveryErr, requestDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else {
      res.json(requestDetails)
    }
  })
})

router.put('/updateRequestedStockStatus/:requestId', (req, res) => {
  const { requestId } = req.params.requestId
  stockRequestQueries.updateRequestedStockStatus({ requestId, status }, (deliveryErr, requestDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else if (!requestDetails.affectedRows) res.json(requestDetails)
    else {
      departmenttransactionQueries.createDepartmentTransaction({ userId: adminUserId, description: `Status changed to ${status} by ${userRole} <b>(${userName})</b>`, transactionId: requestId, departmentId, type: 'warehouse', subType: 'stockRequest' })
      res.json(requestDetails)
    }
  })
})

router.put('/updateStockDetails', (req, res) => {
  stockRequestQueries.updateRequestStock(req.body, (deliveryErr, requestDetails) => {
    if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
    else {
      updateProductDetails(req.body.products).then(data => {
        res.json(requestDetails)
      })
    }
  })
})

const updateProductDetails = (products) => {
  return new Promise(async (resolve, reject) => {
    if (products.length) {
      // let logs = [], count = 0
      for (let i of products) {
        // let productLog = await compareProductsData(i, { type: "customer", customerId, userId, userRole, userName })
        // logs.push(...productLog)
        let requestedProductsQuery = "UPDATE requestedproducts SET noOfJarsTobePlaced=?,productPrice=?,productName=? where productId=" + i.productId;
        let updateQueryValues = [i.noOfJarsTobePlaced, i.productPrice, i.productName]
        db.query(requestedProductsQuery, updateQueryValues, (err, results) => {
          if (err) reject(err);
          else {
            // count++
            // if (count == products.length) {
            //   if (logs.length) {
            //     auditQueries.createLog(logs, (err, data) => {
            //       if (err) console.log('log error', err)
            //       else console.log('log data', data)
            //     })
            //   }
            // }
            resolve(results)
          }
        });
      }
    }
  })
}

const saveDC = (req, res) => {
  let { customerName, contactPerson, phoneNumber, address, routeId, driverId, product20L, product1L, product500ML, product300ML, product2L, warehouseId, customerType, existingCustomerId, distributorId, creationType, isDelivered = 'InProgress', deliveryLocation, price20L, price2L, price1L, price500ML, price300ML, EmailId, deliveredDate } = req.body;
  let dcCreateQuery = "insert into customerorderdetails (customerName,contactPerson,phoneNumber,address,routeId,driverId,20LCans,1LBoxes,500MLBoxes,300MLBoxes,2LBoxes,warehouseId,customerType,existingCustomerId,distributorId,creationType,isDelivered,deliveryLocation,price20L,price2L,price1L,price500ML,price300ML,EmailId,deliveredDate) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let insertQueryValues = [customerName, contactPerson, phoneNumber, address, routeId, driverId, product20L, product1L, product500ML, product300ML, product2L, warehouseId, customerType, existingCustomerId, distributorId, creationType, isDelivered, deliveryLocation, price20L, price2L, price1L, price500ML, price300ML, EmailId, !driverId ? new Date() : null]
  db.query(dcCreateQuery, insertQueryValues, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      let inserted_id = results.insertId;
      departmenttransactionQueries.createDepartmentTransaction({ userId: adminUserId, description: `DC  Created by ${userRole} <b>(${userName})</b>`, transactionId: results.insertId, departmentId, type: 'warehouse', subType: 'delivery' })
      let updateQuery = "update customerorderdetails set dcNo=? where customerOrderId=?"
      let updateQueryValues = ["DC-" + inserted_id, inserted_id];
      db.query(updateQuery, updateQueryValues, (err1, results1) => {
        if (err1) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          warehouseQueries.getDeliverysByCustomerOrderId(inserted_id, (deliveryErr, deliveryDetails) => {
            if (deliveryErr) res.status(500).json({ status: 500, message: deliveryErr.sqlMessage });
            else res.json(deliveryDetails)
          })
        }
      });
    }
  });
}
module.exports = router;
