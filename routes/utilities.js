var express = require('express');
var router = express.Router();
const db=require('../config/db.js')
var cron = require('node-cron');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];


  //Scheduling the 
cron.schedule('0 0 2 * * *', function(){
    var day=days[new Date().getDay()];

    let customerDeliveryDaysQuery="SELECT c.customerId,d.shortName FROM customerdetails c INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliveryDaysId INNER JOIN departmentmaster d ON c.departmentId=d.departmentId WHERE "+day+"=1 AND c.isActive=1";

    db.query(customerDeliveryDaysQuery,(err,results)=>{
  
        if(err) throw err;        
      
        if(results.length>0){
        results.forEach(result => {
           var customerId=result.customerId;
           var warehouseName=result.shortName+"-";
           console.log(warehouseName);
           console.log(customerId);

           let orderDetailsInsertQuery="insert into orderdetails(ordertype,itemsCount,customerId) values(?,?,?)";
           db.query(orderDetailsInsertQuery,['test','5',customerId],(err,results)=>{

            console.log(orderDetailsInsertQuery);
      
              if(err) throw err;
              else{
                  let updateQuery="update orderdetails set transactionid=? where orderid=?"
                db.query(updateQuery,[warehouseName+results.insertId,results.insertId],(err,results)=>{
                    if(err) throw err;
                    else
                        console.log('record inserted');
                });
              }
      
          });
        });

    }
    });
  });



//module.exports=cron;
