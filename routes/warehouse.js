var express = require('express');
var router = express.Router();
const db = require('../config/db.js')

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


router.get('/getroutes', (req, res) => {

  let query = "select * from routes";
  let result = db.query(query, (err, results) => {

    if (err) res.send(err);

    res.send(JSON.stringify(results));


  });
});


router.get('/getdriverDetails/:warehouseId', (req, res) => {

  let warehouseId = req.params.warehouseId;

  let query = "select * from driverdetails where departmentId=" + warehouseId;
  let result = db.query(query, (err, results) => {

    if (err) res.send(err);

    res.send(JSON.stringify(results));


  });
});

router.get('/getNewStockDetails/:id', (req, res) => {

  let warehouseId = req.params.id;
  console.log("warehouseId::::::::" + warehouseId);
  let query = "SELECT n.20LCans AS twentyLCans,n.1LBoxes AS OneLBoxes,n.500MLBoxes AS fiveHLBoxes,n.isConfirmed,n.id,n.MPDCNo,n.deliveryDate,n.returnStockId,d.*,r.* FROM newstockdetails n INNER JOIN departmentmaster d ON d.departmentId=n.warehouseid INNER JOIN returnstockdetails r ON r.id=n.returnstockid  WHERE warehouseId=" + warehouseId;

  let result = db.query(query, (err, results) => {

    if (err) res.send(err);

    res.send(JSON.stringify(results));
  });

});



router.post('/createDC', (req, res) => {
  let dcCreateQuery = "insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,20LCans,1LBoxes,500MLBoxes,250MLBoxes,warehouseId) values(?,?,?,?,?,?,?,?,?,?)";
  let dcDetails = req.body;
  let insertQueryValues = [dcDetails.customerName, dcDetails.phoneNumber, dcDetails.address, dcDetails.routeId, dcDetails.driverId, dcDetails.Cans20L, dcDetails.Boxes1L, dcDetails.Boxes500ML, dcDetails.Boxes250ML, dcDetails.warehouseId]
  db.query(dcCreateQuery, insertQueryValues, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      let inserted_id = results.insertId;
      let updateQuery = "update customerorderdetails set dcNo=? where customerOrderId=?"
      let updateQueryValues = ["DC-" + inserted_id, inserted_id];
      console.log(updateQueryValues);
      db.query(updateQuery, updateQueryValues, (err1, results1) => {
        if (err1) res.json({ status: 500, message: err.sqlMessage });
        else {
          let deliveryDetailsQuery = "select c.*,c.20LCans AS twentyLCans,c.1LBoxes AS OneLBoxes,c.500MLBoxes AS fiveHLBoxes,c.250MLBoxes AS twofiftyLBoxes,r.*,d.* FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid  WHERE customerOrderId =?";
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
  let updateQueryValues = [dcDetails.customerName, dcDetails.phoneNumber, dcDetails.address, dcDetails.routeId, dcDetails.driverId, dcDetails.Cans20L, dcDetails.Boxes1L, dcDetails.Boxes500ML, dcDetails.Boxes250ML, dcDetails.warehouseId, dcDetails.customerOrderId]
  db.query(dcCreateQuery, updateQueryValues, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      let deliveryDetailsQuery = "select c.*,c.20LCans AS twentyLCans,c.1LBoxes AS OneLBoxes,c.500MLBoxes AS fiveHLBoxes,c.250MLBoxes AS twofiftyLBoxes,r.*,d.* FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid  WHERE customerOrderId =?";
      db.query(deliveryDetailsQuery, [dcDetails.customerOrderId], (deliveryErr, deliveryDetails) => {
        if (deliveryErr) res.json({ status: 500, message: deliveryErr.sqlMessage });
        else res.json({ status: 200, message: "DC Updated successfully", data: deliveryDetails })
      })
    }
  });
})

router.post('/confirmStockRecieved', (req, res) => {

  console.log(req.body);

  let returnStockDetails = req.body;
  let updateQuery = "update newstockdetails set returnStockId=?,isConfirmed=? where id=?";
  let insertQuery = "insert into returnstockdetails (damaged20Lcans,damaged1LBoxes,damaged500MLBoxes,emptyCans) values(?,?,?,?)";

  let insertQueryValues = [returnStockDetails.damaged20LCans, returnStockDetails.damaged1LBoxes, returnStockDetails.damaged500MLBoxes, returnStockDetails.emptyCans]

  let result = db.query(insertQuery, insertQueryValues, (err, results) => {

    console.log(insertQueryValues);

    if (err) res.send(err);
    else {
      let inserted_id = results.insertId;


      console.log("inserted_id:::::" + inserted_id);

      let updateQueryValues = [returnStockDetails.id, "1", inserted_id];

      console.log(updateQueryValues);
      db.query(updateQuery, updateQueryValues, (err1, results1) => {

        if (err1) throw err1;
        else {

          res.send("record inserted");
        }
      });
    }
  });
});


router.get('/deliveryDetails/:date', (req, res) => {
  var date = req.params.date;
  console.log(date);
  let deliveryDetailsQuery = "select c.*,c.20LCans AS twentyLCans,c.1LBoxes AS OneLBoxes,c.500MLBoxes AS fiveHLBoxes,c.250MLBoxes AS twofiftyLBoxes,r.*,d.* FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid INNER JOIN driverdetails d  ON c.driverId=d.driverid  WHERE DATE(`deliveryDate`) ='" + date + "'";

  let result = db.query(deliveryDetailsQuery, (err, results) => {

    if (err) res.send(err);

    res.send(JSON.stringify(results));
  });
});

router.get('/currentActiveStockDetails', (req, res) => {

  let { warehouseId } = req.query;
  let currentActiveStockQuery = "SELECT * FROM customerActiveStock WHERE warehouseId=" + warehouseId;
  db.query(currentActiveStockQuery, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: 'Success', data: results });
  });
});

router.get('/outForDeliveryDetails/:date', (req, res) => {

  var date = req.params.date, { warehouseId } = req.query;

  let outForDeliveryDetailsQuery = "SELECT SUM(c.20LCans) AS total20LCans,SUM(c.1LBoxes) AS total1LBoxes,SUM(c.500MLBoxes) total500MLBoxes,SUM(c.250MLBoxes) total250MLBoxes FROM customerorderdetails c WHERE warehouseId=? and DATE(`deliveryDate`)='" + date + "'";

  let result = db.query(outForDeliveryDetailsQuery, [warehouseId], (err, results) => {
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

module.exports = router;
