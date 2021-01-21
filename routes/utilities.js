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


const insertToCustomerOrderDetails = (result, res, sendResponse) => {
  const { deliveryDetailsId } = result

  return new Promise((resolve, reject) => {
    // customerQueries.getsqlNo("customerorderdetails", (err, results) => {
    // if (err) console.log(err)
    // else {
    let requestBody = result
    // requestBody.dcNo = "DC-" + results[0].orderId
    requestBody.departmentId = result.departmentId || 1
    requestBody.customerType = 'Internal'
    requestBody.phoneNumber = result.phoneNumber
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
          customerQueries.updateDCNo(results.insertId, (err, data) => {
            resolve()
          })
          sendResponse && res && res.json('Success')
        }
      });
    }).catch(err => {
      reject()
      console.log(err)
    })
    // }
    // });
  })

}
//Scheduling the 
cron.schedule('0 0 2 * * *', function () {
  saveToCustomerOrderDetails()
});

function saveToCustomerOrderDetails(customerId, res, deliveryDetailsId) {
  var day = days[new Date().getDay()];

  let customerDeliveryDaysQuery = "SELECT c.deliveryDetailsId,c.customer_Id,c.phoneNumber,c.address,c.contactPerson,c.departmentId,c.routeId,c.driverId,c.latitude,c.longitude,c.location as deliveryLocation FROM DeliveryDetails c INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE c.deleted=0 AND c.isActive=1 AND " + day + "=1";

  if (deliveryDetailsId) {
    customerDeliveryDaysQuery = "SELECT c.deliveryDetailsId,c.customer_Id,c.phoneNumber,c.address,c.contactPerson,c.departmentId,c.routeId,c.driverId,c.latitude,c.longitude,c.location as deliveryLocation FROM DeliveryDetails c INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE c.deleted=0 AND c.isActive=1 AND c.deliveryDetailsId=" + deliveryDetailsId + " AND " + day + "=1";
  }
  if (customerId) {
    customerDeliveryDaysQuery += ' AND customer_Id=' + customerId
  }
  db.query(customerDeliveryDaysQuery, async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const length = results.length
      for (let index = 0; index < length; index++) {
        await insertToCustomerOrderDetails(results[index], res, index === length - 1)
      }
    }
    else res.json('Customer approved successfully')
  });
}


module.exports = { saveToCustomerOrderDetails }
// module.exports = router;
