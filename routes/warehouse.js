var express = require('express');
var router = express.Router();
const db=require('../config/db.js')

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });


  
  router.get('/getroutes',(req,res)=>{

    let query="select * from routes";
    let result=db.query(query,(err,results)=>{
  
      if(err) throw err;
  
      res.send(JSON.stringify(results));
  
  
    });
});

router.get('/getdriverDetails/:warehouseId',(req,res)=>{

  let warehouseId=req.params.warehouseId;

  let query="select * from driverdetails where departmentId="+warehouseId;
  let result=db.query(query,(err,results)=>{

    if(err) throw err;

    res.send(JSON.stringify(results));


  });
});
  router.get('/getNewStockDetails/:id',(req,res)=>{

    let warehouseId=req.params.id;
    console.log("warehouseId::::::::"+warehouseId);
    let query="SELECT n.*,d.*,r.* FROM newstockDetails n INNER JOIN departmentmaster d ON d.departmentId=n.warehouseid INNER JOIN returnstockdetails r ON r.id=n.returnstockid  where warehouseId="+warehouseId;

    let result=db.query(query,(err,results)=>{
  
        if(err) throw err;
    
        res.send(JSON.stringify(results));
    });

  });

  router.post('/createDC',(req,res)=>{

    let dcCreateQuery="insert into CustomerOrderDetails (customerName,phoneNumber,address,routeId,driverId,20LCans,1LBoxes,500MLBoxes,warehouseId) values(?,?,?,?,?,?,?,?,?)";

    console.log(req.body);

    let dcDetails=req.body;

    let insertQueryValues=[dcDetails.customerName,dcDetails.phoneNumber,dcDetails.address,dcDetails.routeId,dcDetails.driverId,dcDetails.Cans20L,dcDetails.Boxes1L,dcDetails.Boxes500ML,dcDetails.warehouseId]
    db.query(dcCreateQuery,insertQueryValues,(err,results)=>{

      console.log(insertQueryValues);

        if(err) throw err;
        else
          res.send("Record Inserted");

    });

  });
  router.post('/confirmStockRecieved',(req,res)=>{

    console.log(req.body);

    let returnStockDetails=req.body;
     let updateQuery="update newstockdetails set returnStockId=? where id=?";
    let insertQuery="insert into returnStockDetails (damaged20Lcans,damaged1LBoxes,damaged500MLBoxes,emptyCans) values(?,?,?,?)";

    let insertQueryValues=[returnStockDetails.damaged20LCans,returnStockDetails.damaged1LBoxes,returnStockDetails.damaged500MLBoxes,returnStockDetails.emptyCans]

    let result=db.query(insertQuery,insertQueryValues,(err,results)=>{
  
      console.log(insertQueryValues);

        if(err) throw err;
        else{
          let inserted_id = results.insertId;


          console.log("inserted_id:::::"+inserted_id);

          let updateQueryValues=[inserted_id,returnStockDetails.id];

          console.log(updateQueryValues);
           db.query(updateQuery,updateQueryValues,(err1,results1)=>{
  
            if(err1) throw err1;
            else{
    
              res.send("record inserted");
            }
        
        });

        }
    
    });
 
  });


  module.exports = router;
