var express = require('express');
var router = express.Router();
const db=require('../config/db.js')
const jwt = require("jsonwebtoken");
const config=require("../config/auth.config.js");
var bcrypt = require("bcryptjs");


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });



  router.post('/login',(req,res)=>{

    let username=req.body.username;
    let password=req.body.password;


    let loginQuery="select * from usermaster where username=?";

    let result=db.query(loginQuery,[username],(err,results)=>{
        //var  passwordIsValid= bcrypt.compareSync(password,encryptedPassword);

        if(err) throw err;
    
        if(results.length==0)
             res.send("User Not Available");
        else{
            passwordIsValid= bcrypt.compareSync(password,results[0].password);
            if(!passwordIsValid)
                res.send("Login Failure");
            else{

                console.log(JSON.stringify(results));
			 
                var data = JSON.stringify(results);
                
                var secret = config.secret;
                   var now = Math.floor(Date.now() / 1000),
                       iat = (now - 10),
                       expiresIn = 3600,
                       expr = (now + expiresIn),
                       notBefore = (now - 10),
                       jwtId = Math.random().toString(36).substring(7);
                   var payload = {
                       iat: iat,
                       jwtid : jwtId,
                       audience : 'BIBO',
                       data : data
                   };	
                   
                jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn : expiresIn}, function(err, token) {
                       
                   if(err){
                       console.log('Error occurred while generating token');
                       console.log(err);
                       return false;
                   }
                    else{
                   if(token != false){
                       //res.send(token);
                       res.header();
                       res.json({
                             "results":
                                     {"status": "true"},
                             "token" : token
                         //  "data" : results.userName
                                           
                         });
                       res.end();
                   }
                   else{
                       res.send("Could not create token");
                       res.end();
                   }
                   
                    }
               });
       
                //res.send("Login Success");

            }

        }
    });


});

module.exports = router;
