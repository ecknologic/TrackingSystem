var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var cron = require('node-cron');
const customerQueries = require('../dbQueries/Customer/queries.js');
const { customerProductDetails } = require('../utils/functions.js');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const insertToCustomerOrderDetails = async (result, res) => {
  var seqNo = "";
  const { deliveryDetailsId } = result
  customerQueries.getsqlNo("customerorderdetails", (err, results) => {
    if (err) console.log(err)
    else {
      seqNo = results[0].orderId;
          // let { customerName, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude } = result      //uncomment
          let requestBody = result
          // const { customerName, phoneNumber, address, routeId = 0, driverId = 0, existingCustomerId, latitude, longitude } = customerData[0]
          requestBody.dcNo = "DC-" + seqNo
          requestBody.departmentId = result.departmentId || 1
          requestBody.customerType = 'Internal'
          requestBody.phoneNumber = "9985758537"
          customerProductDetails(deliveryDetailsId).then(products => {
            products.map(product => {
              if (product.productName == '20L') {
                requestBody.product20L = product.noOfJarsTobePlaced
                requestBody.price20L = product.productPrice
              } else if (product.productName == '1L') {
                requestBody.product1L = product.noOfJarsTobePlaced
                requestBody.price1L = product.productPrice
              } else if (product.productName == '500ML') {
                requestBody.product500ML = product.noOfJarsTobePlaced
                requestBody.price500ML = product.productPrice
              } else if (product.productName == '250ML') {
                requestBody.product250ML = product.noOfJarsTobePlaced
                requestBody.price250ML = product.productPrice
              }
            })
            customerQueries.saveCustomerOrderDetails(requestBody, (err, results) => {
              if (err) throw err;
              else {
                /*   let updateQuery="update orderdetails set transactionid=? where orderid=?"
                db.query(updateQuery,[warehouseName+results.insertId,results.insertId],(err,results)=>{
                    if(err) throw err;
                    else 
                });*/
                console.log('record inserted');
              }
            });
          }).catch(err => {
            console.log(err)
          })
    }
  });
}
//Scheduling the 
cron.schedule('0 0 2 * * *', function () {
  var day = days[new Date().getDay()];

  let customerDeliveryDaysQuery = "SELECT c.deliveryDetailsId,c.customer_Id,c.phoneNumber,c.address,c.contactPerson,c.departmentId,c.routeId,c.driverId,c.latitude,c.longitude FROM DeliveryDetails c INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE " + day + "=1";

  db.query(customerDeliveryDaysQuery, (err, results) => {

    if (err) throw err;

    if (results.length > 0) {
      results.forEach(result => {
        // var warehouseName=result.shortName+"-";
        insertToCustomerOrderDetails(result)
      });

    }
  });
});




// module.exports = router;
