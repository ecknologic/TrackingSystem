const dayjs = require('dayjs');
var express = require('express');
var router = express.Router();
const db = require('../config/db.js');
const motherPlantDbQueries = require('../dbQueries/motherplant/queries.js');
const usersQueries = require('../dbQueries/users/queries.js');
const warehouseQueries = require('../dbQueries/warehouse/queries.js');
const { DATEFORMAT, INSERTMESSAGE, UPDATEMESSAGE } = require('../utils/constants.js');
const { dbError } = require('../utils/functions.js');
var departmentId;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  departmentId = req.headers['departmentid'] || 1
  console.log('Time: ', Date.now());
  next();
});


router.get('/getroutes', (req, res) => {
  let query = "select routeName, routeDescription, departmentId,routeId from routes ORDER BY createdDateTime DESC";
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
    date: dayjs().format('YYYY-MM-DD'),
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
      usersQueries.updateUserDepartment({ departmentId: results.insertId, userId: req.body.adminId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
          res.json(results);
        }
      })
    }
  });
});
router.post('/updateWarehouse', (req, res) => {
  const { departmentId, adminId: userId, removedAdminId } = req.body
  warehouseQueries.updateWarehouse(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      usersQueries.updateUserDepartment({ departmentId, userId, removedAdminId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
          res.json(results);
        }
      })
    }
  });
});

router.post('/createDC', (req, res) => {
  let dcCreateQuery = "insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,20LCans,1LBoxes,500MLBoxes,250MLBoxes,warehouseId) values(?,?,?,?,?,?,?,?,?,?)";
  let dcDetails = req.body;
  let insertQueryValues = [dcDetails.customerName, dcDetails.phoneNumber, dcDetails.address, dcDetails.routeId, dcDetails.driverId, dcDetails.cans20L, dcDetails.boxes1L, dcDetails.boxes500ML, dcDetails.boxes250ML, dcDetails.warehouseId]
  db.query(dcCreateQuery, insertQueryValues, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      let inserted_id = results.insertId;
      let updateQuery = "update customerorderdetails set dcNo=? where customerOrderId=?"
      let updateQueryValues = ["DC-" + inserted_id, inserted_id];
      db.query(updateQuery, updateQueryValues, (err1, results1) => {
        if (err1) res.json({ status: 500, message: err.sqlMessage });
        else {
          let deliveryDetailsQuery = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS cans20L,c.1LBoxes AS boxes1L,c.500MLBoxes AS boxes500ML,c.250MLBoxes AS boxes250ML,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid  WHERE customerOrderId =?";
          db.query(deliveryDetailsQuery, [inserted_id], (deliveryErr, deliveryDetails) => {
            if (deliveryErr) res.json({ status: 500, message: deliveryErr.sqlMessage });
            else res.json({ status: 200, message: "DC created successfully", data: deliveryDetails })
          })
        }
      });
    }
  });
});

router.put('/updateDC', (req, res) => {
  let dcCreateQuery = "UPDATE customerorderdetails SET customerName=?,phoneNumber=?,address=?,routeId=?,driverId=?,20LCans=?,1LBoxes=?,500MLBoxes=?,250MLBoxes=?,warehouseId=? WHERE customerOrderId=?";
  let dcDetails = req.body;
  let updateQueryValues = [dcDetails.customerName, dcDetails.phoneNumber, dcDetails.address, dcDetails.routeId, dcDetails.driverId, dcDetails.cans20L, dcDetails.boxes1L, dcDetails.boxes500ML, dcDetails.boxes250ML, dcDetails.warehouseId, dcDetails.customerOrderId]
  db.query(dcCreateQuery, updateQueryValues, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      let deliveryDetailsQuery = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS cans20L,c.1LBoxes AS boxes1L,c.500MLBoxes AS boxes500ML,c.250MLBoxes AS boxes250ML,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid   WHERE customerOrderId =?";
      db.query(deliveryDetailsQuery, [dcDetails.customerOrderId], (deliveryErr, deliveryDetails) => {
        if (deliveryErr) res.json({ status: 500, message: deliveryErr.sqlMessage });
        else res.json({ status: 200, message: "DC Updated successfully", data: deliveryDetails })
      })
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
  let deliveryDetailsQuery = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS cans20L,c.1LBoxes AS boxes1L,c.500MLBoxes AS boxes500ML,c.250MLBoxes AS boxes250ML,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE DATE(`deliveryDate`) = ? AND warehouseId=? ORDER BY c.dcNo DESC";
  db.query(deliveryDetailsQuery, [date, departmentId], (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});

router.get('/currentActiveStockDetails/:date', (req, res) => {
  let deliveryDate = req.params.date;
  let { warehouseId } = req.query;
  let currentActiveStockQuery = "SELECT SUM(total1LBoxes) total1LBoxes, SUM(total20LCans) total20LCans, SUM(total500MLBoxes) total500MLBoxes, SUM(total250MLBoxes) total250MLBoxes FROM customerActiveStock WHERE DATE(deliveryDate)<='" + deliveryDate + "' and warehouseId=" + warehouseId;
  db.query(currentActiveStockQuery, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: 'Success', data: results });
  });
});

router.get('/outForDeliveryDetails/:date', (req, res) => {
  var date = req.params.date, { warehouseId } = req.query;
  let outForDeliveryDetailsQuery = "SELECT SUM(c.20LCans) AS total20LCans,SUM(c.1LBoxes) AS total1LBoxes,SUM(c.500MLBoxes) total500MLBoxes,SUM(c.250MLBoxes) total250MLBoxes FROM customerorderdetails c WHERE warehouseId=? and routeId!='NULL' and driverId!='NULL' and DATE(`deliveryDate`)='" + date + "'";
  db.query(outForDeliveryDetailsQuery, [warehouseId], (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: 'Success', data: results });
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

router.get('/getEmptyCans/:warehouseId', (req, res) => {
  let { warehouseId } = req.params;
  let warehouseQuery = "SELECT (SELECT SUM(c.returnemptycans) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT SUM(e.emptycans_count)  FROM EmptyCanDetails e  WHERE e.isconfirmed=1 AND e.warehouse_id=?) AS emptycans";
  db.query(warehouseQuery, [warehouseId, warehouseId], (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: 'Success', data: results.length ? results[0] : results });
  });
});

module.exports = router;
