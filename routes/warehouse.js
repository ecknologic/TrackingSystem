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

  module.exports = router;
