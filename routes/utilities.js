var express = require('express');
var router = express.Router();
const db=require('../config/db.js')

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

router.post('/login',(req,res)=>{

    let username=req.body.username;
    let password=req.body.password;
  console.log(req.body);

    let loginQuery="select * from usermaster where username=? and password=?";

    let result=db.query(loginQuery,[username,password],(err,results)=>{
  
        if(err) throw err;
    
        console.log(results.length);
        if(results.length==0)
             res.send("Login Failure");
        else
            res.send("Login Success");
    });


});

module.exports = router;
