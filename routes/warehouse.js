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
  router.get('/getNewStockDetails/:id',(req,res)=>{

    let warehouseId=req.params.id;
    console.log("warehouseId::::::::"+warehouseId);
    let query="SELECT n.*,d.* FROM newstockDetails n INNER JOIN departmentmaster d ON d.departmentId=n.warehouseid where warehouseId="+warehouseId;

    let result=db.query(query,(err,results)=>{
  
        if(err) throw err;
    
        res.send(JSON.stringify(results));
    });

  });


  module.exports = router;
