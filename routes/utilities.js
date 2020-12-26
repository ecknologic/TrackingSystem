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

    let customerDeliveryDaysQuery="SELECT c.customer_Id FROM DeliveryDetails c INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE "+day+"=1";

    db.query(customerDeliveryDaysQuery,(err,results)=>{
  
        if(err) throw err;        
      
        if(results.length>0){
        results.forEach(result => {
           var customerId=result.customerId;
          // var warehouseName=result.shortName+"-";
          var seqNo="";
          let seqNoQuery="SELECT AUTO_INCREMENT AS orderId FROM information_schema.TABLES WHERE TABLE_NAME='customerorderdetails'"
          db.query(seqNoQuery,(err,results)=>{
            seqNo=results[0].orderId;
          });

           let orderDetailsInsertQuery="insert into customerorderdetails(existingCustomerId,dcNo) values(?,?)";
           db.query(orderDetailsInsertQuery,[customerId,"DC-"+seqNo],(err,results)=>{

      
              if(err) throw err;
              else{
                /*   let updateQuery="update orderdetails set transactionid=? where orderid=?"
                db.query(updateQuery,[warehouseName+results.insertId,results.insertId],(err,results)=>{
                    if(err) throw err;
                    else 
                });*/
                console.log('record inserted');
              }
      
          });
        });

    }
    });
  });



//module.exports=cron;
