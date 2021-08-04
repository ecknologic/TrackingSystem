var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var cron = require('node-cron');
const customerQueries = require('../dbQueries/Customer/queries.js');
const { customerProductDetails } = require('../utils/functions.js');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const dayjs = require('dayjs');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const insertToCustomerOrderDetails = (result, res, sendResponse, userId, userRole, userName) => {
  const { deliveryDetailsId, customer_Id, deliveryLocation } = result

  return new Promise((resolve, reject) => {
    // customerQueries.getsqlNo("customerorderdetails", (err, results) => {
    // if (err) console.log(err)
    // else {
    let requestBody = result
    // requestBody.dcNo = "DC-" + results[0].orderId
    requestBody.departmentId = result.departmentId || 1
    requestBody.customerType = 'internal'
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
        } else if (product.productName == '300ML') {
          requestBody.product300ML = product.noOfJarsTobePlaced
          requestBody.price300ML = product.productPrice
        } else if (product.productName == '2L') {
          requestBody.product2L = product.noOfJarsTobePlaced
          requestBody.price2L = product.productPrice
        }
      })
      customerQueries.checkDCExistsForTodayOrNot({ customer_Id, deliveryLocation }, (err, data) => {
        if (err) resolve()
        else if (data.length) {
          if (sendResponse && res) res.status(409).json('Dc already exists')
          else resolve()
        } else {
          customerQueries.saveCustomerOrderDetails(requestBody, (err, results) => {
            if (err) throw err;
            else {
              customerQueries.updateDCNo(results.insertId, (err, data) => {
                resolve()
              })
              if (sendResponse && res) {
                if (userId) {
                  auditQueries.createLog({ userId, description: `Customer ${deliveryDetailsId ? 'Delivery Details' : ""} Approved by ${userRole} <b>(${userName})</b>`, customerId: result.customer_Id, type: "customer" }, (err, data) => {
                    if (err) console.log('errors>>>>', err)
                    else console.log('data>>>', data)
                  })
                }
                res.json('Success')
              }
            }
          });
        }
      })
    }).catch(err => {
      reject()
      console.log(err)
    })
    // }
    // });
  })

}
//Scheduling the 
cron.schedule('0 0 0 * * *', function () {
  saveToCustomerOrderDetails()
});

function saveToCustomerOrderDetails(customerId, res, deliveryDetailsId, userId, userRole, userName) {
  var day = days[new Date().getDay()];

  let customerDeliveryDaysQuery = "SELECT c.deliveryDetailsId,c.customer_Id,c.phoneNumber,c.address,c.contactPerson,c.departmentId,c.routeId,c.driverId,c.latitude,c.longitude,c.location as deliveryLocation,IFNULL(cust.organizationName,cust.customerName) AS customerName  FROM DeliveryDetails c INNER JOIN customerdetails cust ON c.customer_Id=cust.customerId INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE c.deleted=0 AND c.isActive=1 AND c.isClosed=0 AND " + day + "=1 AND DATE(cust.approvedDate)!=" + dayjs().format('YYYY-MM-DD');

  if (deliveryDetailsId) {
    customerDeliveryDaysQuery = "SELECT c.deliveryDetailsId,c.customer_Id,c.phoneNumber,c.address,c.contactPerson,c.departmentId,c.routeId,c.driverId,c.latitude,c.longitude,c.location as deliveryLocation,IFNULL(cust.organizationName,cust.customerName) AS customerName  FROM DeliveryDetails c INNER JOIN customerdetails cust ON c.customer_Id=cust.customerId INNER JOIN  customerdeliverydays cd ON cd.deliveryDaysId=c.deliverydaysid  WHERE c.deleted=0 AND c.isActive=1 AND c.isClosed=0 AND c.deliveryDetailsId=" + deliveryDetailsId + " AND " + day + "=1";
  }
  if (customerId) {
    customerDeliveryDaysQuery += ' AND customer_Id=' + customerId
  }
  db.query(customerDeliveryDaysQuery, async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const length = results.length
      for (let index = 0; index < length; index++) {
        await insertToCustomerOrderDetails(results[index], res, index === length - 1, userId, userRole, userName)
      }
    }
    else {
      if (userId) {
        auditQueries.createLog({ userId, description: `Customer ${deliveryDetailsId ? 'Delivery Details' : ""} Approved by ${userRole} <b>(${userName})</b>`, customerId, type: "customer" }, (err, data) => {
          if (err) console.log('errors>>>>', err)
          else console.log('data>>>', data)
        })
      }
      res && res.json('Customer approved successfully')
    }
  });
}


module.exports = { saveToCustomerOrderDetails }
// module.exports = router;
