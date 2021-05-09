const QRCode = require('qrcode')
var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var fs = require("fs");
let filePath;
var NodeGeocoder = require('node-geocoder');
const opencage = require("../config/opencage.config.js");
const { Buffer } = require('buffer');
const multer = require('multer');
const customerQueries = require('../dbQueries/Customer/queries.js');
const { customerProductDetails, dbError, getCompareCustomersData, getCompareDistributorsData } = require('../utils/functions.js');
const { saveToCustomerOrderDetails } = require('./utilities');
const { createInvoice } = require('./Invoice/invoice');
const { UPDATEMESSAGE, DELETEMESSAGE } = require('../utils/constants.js');
const usersQueries = require('../dbQueries/users/queries.js');
const warehouseQueries = require('../dbQueries/warehouse/queries.js');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const departmenttransactionQueries = require('../dbQueries/departmenttransactions/queries.js');
const { compareCustomerData, compareCustomerDeliveryData, compareProductsData, compareOrderData } = require('./utils/customer.js');
let departmentId, userId, userName, userRole;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assests/idproofs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage }).array('idProofs', 2)

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: opencage.apikey
});

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  departmentId = req.headers['departmentid']
  userId = req.headers['userid']
  userName = req.headers['username']
  userRole = req.headers['userrole']
  next();
});
// router.post('/uploadphoto', (req, res) => {
// upload(req, res, function (err, data) {
//   if (err) {
//     res.json({ error_code: 1, err_desc: err });
//     return;
//   }
//   Object.keys(req.files).forEach(function (k) {
//     console.log(k + ' - ' + req.files[k]);
//   });

//   req.files.forEach(file => {
//     console.log(file.path);
//   })
const uploadImage = (req) => {
  return new Promise((resolve, reject) => {
    let idproofdetailsquery = "insert  into customerDocStore(idProof_frontside,idProof_backside,gstProof) values(?,?,?)";
    var idProof_frontside, idProof_backside, gstProof;
    let { idProofs } = req.body;
    if (req.body.test) {
      idProof_frontside = Buffer.from(idProofs[0], 'base64')
      idProof_backside = idProofs[1] ? Buffer.from(idProofs[1], 'base64') : null
      gstProof = req.body.gstProof ? Buffer.from(req.body.gstProof, 'base64') : null
    } else {
      idProof_frontside = Buffer.from(idProofs[0].replace(/^data:image\/\w+;base64,/, ""), 'base64')
      idProof_backside = idProofs[1] ? Buffer.from(idProofs[1].replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
      gstProof = req.body.gstProof ? Buffer.from(req.body.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
    }
    let insertQueryValues = [idProof_frontside, idProof_backside, gstProof]
    db.query(idproofdetailsquery, insertQueryValues, (err, results) => {
      if (err) reject(err);
      else {
        resolve(results.insertId);
      }
    })
  })
}
const updateProofs = (req) => {
  return new Promise((resolve, reject) => {
    let { idProofs, customer_id_proof, gstProof } = req.body;
    let idproofdetailsquery = "UPDATE customerDocStore SET idProof_frontside=?,idProof_backside=?,gstProof=? WHERE docId=" + customer_id_proof;
    var idProof_frontside, idProof_backside, gstProofData;
    if (req.body.test) {
      idProof_frontside = Buffer.from(idProofs[0], 'base64')
      idProof_backside = idProofs[1] ? Buffer.from(idProofs[1], 'base64') : null
      gstProofData = gstProof ? Buffer.from(gstProof, 'base64') : null
    } else {
      idProof_frontside = Buffer.from(idProofs[0].replace(/^data:image\/\w+;base64,/, ""), 'base64')
      idProof_backside = idProofs[1] ? Buffer.from(idProofs[1].replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
      gstProofData = gstProof ? Buffer.from(gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
    }
    let insertQueryValues = [idProof_frontside, idProof_backside, gstProofData]
    db.query(idproofdetailsquery, insertQueryValues, (err, results) => {
      if (err) reject(err);
      else {
        resolve(results);
      }
    })
  })
}
// });
// })
router.get('/getPhoto', (req, res) => {
  let query = "SELECT * FROM customerDocStore";
  // let query = "SELECT * FROM customerdetails WHERE customerId=" + customerId;
  db.query(query, (err, results) => {
    if (err) res.status(500).json(err);
    else {
      res.send(results)
    }
  })
})
router.get('/getQrcode/:customerId', (req, res) => {
  let customerId = req.params.customerId;
  let query = "SELECT mobileNumber,adharNo FROM customerdetails WHERE customerId=" + customerId;
  let result = db.query(query, (err, results) => {
    let qrText;
    if (err) res.status(500).json(err);
    if (results.length) {
      qrText = results[0].adharNo + results[0].mobileNumber
    }
    res.send(JSON.stringify(qrText));

  });
});
router.get('/getCustomers', (req, res) => {
  let query = "SELECT * from customerdetails where deleted=0";
  db.query(query, (err, results) => {
    if (err) res.status(500).json(err);
    res.send(JSON.stringify(results));
  });
});



router.post('/createCustomer', async (req, res) => {
  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,alternatePhNo,EmailId,Address1,Address2,gstNo,contactperson,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,departmentId,deliveryDaysId,depositAmount,isActive,latitude,longitude,shippingAddress,shippingContactPerson,shippingContactNo,customerType,organizationName,createdBy,customer_id_proof,idProofType,pincode,dispenserCount,contractPeriod,rocNo,poNo,salesAgent) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let customerdetails = req.body;
  const { customerName, mobileNumber, alternatePhNo, EmailId, Address1, Address2, gstNo, contactperson, panNo, adharNo, invoicetype, natureOfBussiness, creditPeriodInDays, referredBy, departmentId, deliveryDaysId, depositAmount, isActive, shippingAddress, shippingContactPerson, shippingContactNo, customertype, organizationName, createdBy, idProofType, pinCode, dispenserCount, contractPeriod, rocNo, poNo, alternateNumber, salesAgent } = customerdetails
  customerQueries.checkCustomerExistsOrNot({ EmailId, mobileNumber }, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else if (results.length) {
      res.status(400).json({ status: 400, message: "This Customer already created" })
    }
    else {
      let promiseArray = req.body.idProofs[0] != null ? [getLatLongDetails(customerdetails), uploadImage(req)] : [getLatLongDetails(customerdetails)]
      Promise.all(promiseArray)
        .then(response => {
          let registeredDate = customerdetails.registeredDate ? customerdetails.registeredDate : new Date()
          let customer_id_proof = response[1] && response[1]
          let insertQueryValues = [customerName, mobileNumber, alternatePhNo, EmailId, Address1, Address2, gstNo, contactperson, panNo, adharNo, registeredDate, invoicetype, natureOfBussiness, creditPeriodInDays, referredBy, departmentId, deliveryDaysId, depositAmount, isActive, response[0].latitude, response[0].longitude, shippingAddress, shippingContactPerson, shippingContactNo, customertype, organizationName, createdBy, customer_id_proof, idProofType, pinCode, dispenserCount, contractPeriod, rocNo, poNo, salesAgent]
          db.query(customerDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
            else {
              saveDeliveryDetails(results.insertId, customerdetails, res)
            }
          });
        })
    }
  })
});
const saveDeliveryDetails = (customerId, customerdetails, res) => {
  return new Promise(async (resolve, reject) => {
    if (customerdetails.deliveryDetails.length) {
      let count = 0
      for (let i of customerdetails.deliveryDetails) {
        let latLong = await getLatLongDetails({ Address1: i.address })
        saveDeliveryDays(i.deliveryDays).then(deliveryDays => {
          let deliveryDetailsQuery = "insert  into DeliveryDetails (gstNo,location,address,phoneNumber,contactPerson,deliverydaysid,depositAmount,customer_Id,departmentId,isActive,gstProof,registeredDate,latitude,longitude,routeId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          var gstProof = i.gstProof && Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
          let registeredDate = new Date()
          let insertQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, deliveryDays.insertId, i.depositAmount, customerId, i.departmentId, i.isApproved, gstProof, registeredDate, latLong.latitude, latLong.longitude, i.routeId]
          db.query(deliveryDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              saveProductDetails(i.products, results.insertId, customerId).then(productDetails => {
                // console.log(count, customerdetails.deliveryDetails.length)
                if (count == customerdetails.deliveryDetails.length) {
                  auditQueries.createLog({ userId, description: `Customer created by ${userRole} <b>(${userName})</b>`, customerId, type: "customer" })
                  res.json({ status: 200, message: "Customer Created Successfully" })
                }
              })
            }
          });
        })
      }
    }
  })
}
const saveDeliveryDays = (deliveryDays) => {
  return new Promise((resolve, reject) => {
    let deliveryDayQuery = "insert  into customerdeliverydays (SUN,MON,TUE,WED,THU,FRI,SAT) values(?,?,?,?,?,?,?)";
    let insertQueryValues = [deliveryDays.SUN, deliveryDays.MON, deliveryDays.TUE, deliveryDays.WED, deliveryDays.THU, deliveryDays.FRI, deliveryDays.SAT]
    db.query(deliveryDayQuery, insertQueryValues, (err, results) => {
      if (err) res.status(400).json({ status: 400, message: err.sqlMessage });
      else resolve(results)
    });
  })
}
const updateDeliveryDays = (deliveryDays, deliverydaysid) => {
  return new Promise((resolve, reject) => {
    let deliveryDayQuery = "update customerdeliverydays SET SUN=?,MON=?,TUE=?,WED=?,THU=?,FRI=?,SAT=? WHERE deliveryDaysId=" + deliverydaysid;
    let insertQueryValues = [deliveryDays.SUN, deliveryDays.MON, deliveryDays.TUE, deliveryDays.WED, deliveryDays.THU, deliveryDays.FRI, deliveryDays.SAT]
    db.query(deliveryDayQuery, insertQueryValues, (err, results) => {
      if (err) console.log(err.sqlMessage);
      else resolve(results)
    });
  })
}
const saveProductDetails = (products, deliveryDetailsId, customerId) => {
  return new Promise((resolve, reject) => {
    if (products.length) {
      for (let i of products) {
        let deliveryProductsQuery = "insert  into customerproductdetails (deliverydetailsId,customerId,noOfJarsTobePlaced,productPrice,productName) values(?,?,?,?,?)";
        let insertQueryValues = [deliveryDetailsId, customerId, i.noOfJarsTobePlaced, i.productPrice, i.productName]
        db.query(deliveryProductsQuery, insertQueryValues, (err, results) => {
          if (err) reject(err);
          else resolve(results)
        });
      }
    }
  })
}
const updateProductDetails = (products, customerId) => {
  return new Promise(async (resolve, reject) => {
    if (products.length) {
      let logs = [], count = 0
      for (let i of products) {
        let productLog = await compareProductsData(i, { type: "customer", customerId, userId, userRole, userName })
        logs.push(...productLog)
        let deliveryProductsQuery = "UPDATE customerproductdetails SET noOfJarsTobePlaced=?,productPrice=?,productName=? where id=" + i.productId;
        let updateQueryValues = [i.noOfJarsTobePlaced, i.productPrice, i.productName]
        db.query(deliveryProductsQuery, updateQueryValues, (err, results) => {
          if (err) reject(err);
          else {
            count++
            if (count == products.length) {
              if (logs.length) {
                auditQueries.createLog(logs, (err, data) => {
                  if (err) console.log('log error', err)
                  else console.log('log data', data)
                })
              }
            }
            resolve(results)
          }
        });
      }
    }
  })
}
const createQrCode = (qrcodeText) => {
  return new Promise((resolve, reject) => {
    filePath = "assests/QRImages/" + qrcodeText + ".png";
    QRCode.toFile(filePath, qrcodeText, {
      color: {
        dark: '#00F'  // Blue dots
      }
    }, function (err) {
      if (err) reject(err)
      else {
        let customerDetailsQuery = "insert  into QRDetails (QRImage) values(?)";
        let insertQueryValues = [fs.readFileSync(filePath)]
        db.query(customerDetailsQuery, insertQueryValues, (err, results) => {
          if (err) reject(err);
          else {
            resolve(results.insertId);
          }
        })
      }
    })
  })

}

const getLatLongDetails = (req) => {
  return new Promise((resolve, reject) => {
    // geocoder.geocode(req.Address1 + "," + req.Address2, function (err, res) {
    geocoder.geocode(req.Address1, function (err, res) {
      if (err) reject(err)
      else resolve({
        latitude: res.length ? res[0].latitude : "",
        longitude: res.length ? res[0].longitude : ""
      })
    });
  })
}
router.post("/approveCustomer/:customerId", (req, res) => {
  const { customerId } = req.params;
  const { isSuperAdminApproved } = req.body
  customerQueries.approveCustomer({ customerId, isSuperAdminApproved }, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      customerQueries.approveDeliveryDetails(req.body.deliveryDetailsIds, (err, updatedDelivery) => {
        if (err) res.json({ status: 500, message: err.sqlMessage });
        else {
          saveToCustomerOrderDetails(customerId, res, null, userId)
        }
      })
    }
  })
});

router.post("/approveCustomerDirectly/:customerId", (req, res) => {
  const { customerId } = req.params;
  const { isSuperAdminApproved } = req.body
  customerQueries.approveCustomer({ customerId, isSuperAdminApproved }, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      customerQueries.approveOutDeliveryDetails(customerId, (err, updatedDelivery) => {
        if (err) res.json({ status: 500, message: err.sqlMessage });
        else {
          saveToCustomerOrderDetails(customerId, res, null, userId, userRole, userName)
        }
      })
    }
  })
});

router.post("/createOrderDelivery", (req, res) => {
  const { deliveryDetailsId } = input
  customerQueries.updateOrderDelivery(req.body, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      auditQueries.createLog({ userId, description: `Delivery details Updated by ${userRole} <b>(${userName})</b>`, customerId: results.length && results[0].existingCustomerId, type: "customer" })

      departmenttransactionQueries.createDepartmentTransaction({ userId, description: "Order Updated", transactionId: deliveryDetailsId, departmentId, type: 'warehouse', subType: 'order' })
      res.json(results)
    }
  })
});
router.get("/approveDelivery/:deliveryDetailsId", (req, res) => {
  const { deliveryDetailsId } = req.params;
  customerQueries.approveDeliveryDetails([deliveryDetailsId], (err, data) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      saveToCustomerOrderDetails(null, res, deliveryDetailsId)
      // res.json('Delivery Details Approved Successfully')
    }
  })
});

router.get("/getCustomerDetails/:creatorId", (req, res) => {
  let customerDetailsQuery = "SELECT c.customerNo,c.organizationName,c.isActive,c.customertype,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.createdBy=? AND d.deleted='0'  GROUP BY c.customerNo,c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
  db.query(customerDetailsQuery, [req.params.creatorId], (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});

router.get("/getMarketingCustomerDetails", (req, res) => { // maraketing manager and all maraketing admins
  let customerDetailsQuery = "SELECT c.organizationName,c.createdBy,c.isActive,c.customertype,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id LEFT JOIN usermaster u ON c.createdBy=u.userId WHERE u.RoleId=5 OR u.RoleId=7 AND d.deleted='0'  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate,c.createdBy ORDER BY c.registeredDate DESC"
  db.query(customerDetailsQuery, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});

router.get("/getRoutes/:departmentId", (req, res) => {
  customerQueries.getRoutesByDepartmentId(req.params.departmentId, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(results)
    }
  })
});
router.get("/getOrders", (req, res) => {
  customerQueries.getOrdersByDepartmentId(departmentId, (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else if (results.length) {
      let arr = [], count = 0;
      for (let result of results) {
        customerProductDetails(result.deliveryDetailsId).then(response => {
          count++
          if (err) console.log(err);
          else {
            result["products"] = response;
            arr.push(result)
          }
          if (count == results.length) {
            let sortedData = arr.sort((a, b) => b.registeredDate - a.registeredDate)
            res.json(sortedData);
          }
        });
      }
    }
    else {
      res.json(results)
    }
  })
});

router.get("/getCustomerDetailsByType/:customertype", (req, res) => {
  customerQueries.getCustomersByCustomerType(req.params.customertype, (err, customersData) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(customersData)
    }
  })
});
router.get("/getInActiveCustomers", (req, res) => {
  customerQueries.getInActiveCustomers((err, customersData) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(customersData)
    }
  })
});
router.get("/getCustomerDetailsByStatus/:approvedStatus", (req, res) => {
  customerQueries.getCustomerDetailsByStatus(req.params.approvedStatus, (err, customersData) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(customersData)
    }
  })
});

router.get("/getCustomerDetailsById/:customerId", (req, res) => {
  customerQueries.getCustomerDetails(req.params.customerId, (err, results) => {
    if (err) res.status(500).json(err);
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});

router.get("/getCustomerDetailsForDC/:customerId", (req, res) => {
  customerQueries.getCustomerDetailsForDC(req.params.customerId, (err, results) => {
    if (err) res.status(500).json(err);
    else if (results.length) {
      getDeliveryDetails({ customerId: req.params.customerId, isSuperAdmin: 'false' }).then(response => {
        customerProductDetails(response[0].deliveryDetailsId, "customer").then(products => {
          console.log('products>>', products)
          results[0].products = products
          res.json({ status: 200, statusMessage: "Success", data: results })
        })
      })
    }
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});

router.get("/getCustomerDeliveryDetails/:customerId", (req, res) => {
  const { customerId } = req.params
  const { isSuperAdmin = 'false' } = req.query;
  getDeliveryDetails({ customerId, isSuperAdmin }).then(response => {
    const customerDeliveryDetails = [{}];
    customerDeliveryDetails[0]["deliveryDetails"] = response;
    res.json({ status: 200, statusMessage: "Success", data: customerDeliveryDetails })
  })
});

router.get("/getProductsDetails", (req, res) => {
  let productDetailsQuery = "SELECT * from productdetails"
  db.query(productDetailsQuery, (err, results) => {
    if (err) res.status(500).json(err);
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});
router.get("/getDeliveryDetails/:deliveryDetailsId", async (req, res) => {
  const { deliveryDetailsId } = req.params;
  let data = await getDeliveryDetails({ deliveryDetailsId, isSuperAdmin: 'true' })
  res.json({ status: 200, statusMessage: "Success", data })
});
// router.get("/getLongitudeandLatitude/:address", (req, response) => {
//   geocoder.geocode(req.params.address, function (err, res) {
//     response.send("lattitue:::" + res[0].latitude + "longitude:::" + res[0].longitude);
//   });
// });
// router.get('/test', (req, res) => {
const getAddedDeliveryDetails = (deliveryDetailsId) => {
  return getDeliveryDetails({ deliveryDetailsId })
}
// })
const getDeliveryDetails = ({ customerId, deliveryDetailsId, isSuperAdmin }) => {
  return new Promise((resolve, reject) => {
    let deliveryDetailsQuery = "SELECT d.location,d.contactPerson,d.customer_Id,d.deliveryDetailsId,d.phoneNumber,d.isActive as isApproved,d.location AS deliveryLocation,r.departmentName,ro.routeName FROM DeliveryDetails d INNER JOIN routes ro ON d.routeId=ro.RouteId INNER JOIN departmentmaster r ON r.departmentId=d.departmentId WHERE d.deleted=0 AND (d.customer_Id=? OR d.deliveryDetailsId=?) ORDER BY d.registeredDate DESC";
    if (isSuperAdmin == 'true') {
      deliveryDetailsQuery = "SELECT d.*,d.isActive as isApproved,d.location AS deliveryLocation,r.departmentName,ro.routeName,json_object('SUN',cd.SUN,'MON',cd.MON,'TUE',cd.TUE,'WED',cd.WED,'THU',cd.THU,'FRI',cd.FRI,'SAT',cd.SAT) as 'deliveryDays' " +
        /*  "concat(CASE WHEN cd.sun=1 THEN 'Sunday,' ELSE '' END,"+
         "CASE WHEN cd.mon=1 THEN 'Monday,' ELSE '' END,"+
         "CASE WHEN cd.tue=1 THEN 'Tuesday,' ELSE '' END,"+
         "CASE WHEN cd.wed=1 THEN 'Wednesday,' ELSE '' END,"+
         "CASE WHEN cd.thu=1 THEN 'Thursday,' ELSE '' END,"+
         "CASE WHEN cd.fri=1 THEN 'Friday,' ELSE '' END,"+
         "CASE WHEN cd.sat=1 THEN 'Saturday,' ELSE '' END) AS 'Delivery Days'"+ */
        "FROM DeliveryDetails d INNER JOIN routes ro ON d.routeId=ro.RouteId INNER JOIN customerdeliverydays cd ON cd.deliveryDaysId=d.deliverydaysid INNER JOIN departmentmaster r ON r.departmentId=d.departmentId WHERE d.deleted=0 AND (d.customer_Id=? OR d.deliveryDetailsId=?) ORDER BY d.registeredDate DESC;";
    }
    db.query(deliveryDetailsQuery, [customerId, deliveryDetailsId], (err, results) => {
      if (err) reject(err)
      else {
        if (results.length) {
          if (isSuperAdmin == 'true') {
            let arr = [], count = 0;
            for (let result of results) {
              customerProductDetails(result.deliveryDetailsId).then(response => {
                count++
                if (err) reject(err);
                else {
                  result['deliveryDays'] = JSON.parse(result.deliveryDays)
                  result["products"] = response;
                  arr.push(result)
                }
                if (count == results.length) resolve(arr);
              });
            }
          } else resolve(results)
        } else resolve([])
      }
    });
  });
}

router.post('/updateCustomer', async (req, res) => {
  let customerdetails = req.body;
  const { customer_id_proof, customerName, mobileNumber, alternatePhNo, EmailId, Address1, Address2, gstNo, contactperson, panNo, adharNo, invoicetype, natureOfBussiness, creditPeriodInDays, referredBy, departmentId, deliveryDaysId, depositAmount, isActive, shippingAddress, shippingContactPerson, shippingContactNo, customertype, organizationName, idProofType, pinCode, dispenserCount, contractPeriod, rocNo, poNo, customerId, salesAgent } = customerdetails
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  customerQueries.checkCustomerExistsOrNot({ EmailId, mobileNumber }, async (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else if (results.length && results[0].customerId != customerId) {
      res.status(400).json({ status: 400, message: "This Customer already created" })
    }
    else {
      const logs = await compareCustomerData(customerdetails, { userId, userRole, userName })
      let customerDetailsQuery = "UPDATE customerdetails SET customerName=?,mobileNumber=?,alternatePhNo=?,EmailId=?,Address1=?,Address2=?,gstNo=?,contactperson=?,panNo=?,adharNo=?,invoicetype=?,natureOfBussiness=?,creditPeriodInDays=?,referredBy=?,departmentId=?,deliveryDaysId=?,depositAmount=?,isActive=?,latitude=?,longitude=?,shippingAddress=?,shippingContactPerson=?,shippingContactNo=?,customerType=?,organizationName=?,idProofType=?,pincode=?, dispenserCount=?, contractPeriod=?,rocNo=?,poNo=?,customer_id_proof=?,salesAgent=? WHERE customerId=" + customerId;
      let promiseArray = req.body.idProofs[0] != null ? [getLatLongDetails(customerdetails), customer_id_proof ? updateProofs(req) : uploadImage(req)] : [getLatLongDetails(customerdetails)]
      Promise.all(promiseArray)
        .then(response => {
          let customerIdProof = req.body.idProofs[0] != null && customer_id_proof ? customer_id_proof : response[1]
          let updateQueryValues = [customerName, mobileNumber, alternatePhNo, EmailId, Address1, Address2, gstNo, contactperson, panNo, adharNo, invoicetype, natureOfBussiness, creditPeriodInDays, referredBy, departmentId, deliveryDaysId, depositAmount, isActive, response[0].latitude, response[0].longitude, shippingAddress, shippingContactPerson, shippingContactNo, customertype, organizationName, idProofType, pinCode, dispenserCount, contractPeriod, rocNo, poNo, customerIdProof, salesAgent]
          // let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.EmailId, customerdetails.Address1, customerdetails.gstNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.isActive, response[0], response[1].latitude, response[1].longitude, customerdetails.customerType, customerdetails.organizationName, customerdetails.createdBy]
          db.query(customerDetailsQuery, updateQueryValues, (err, results) => {
            if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
            else {

              if (logs.length) {
                auditQueries.createLog(logs, (err, data) => {
                  if (err) console.log('log error', err)
                  else console.log('log data', data)
                })
              }
              res.json({ status: 200, message: 'Customer Updated successfully' })
            }
          });
        })
    }
  })
});
router.delete('/deleteDelivery/:deliveryId', (req, res) => {
  customerQueries.deleteDeliveryAddress(req.params.deliveryId, (err, success) => {
    if (err) res.status(500).json(dbError(err))
    else res.json("Deleted successfully")
  })
})
router.put('/updateCustomerOrderDetails', async (req, res) => {
  let { customerOrderId, warehouseId:departmentId, routeId, driverId } = req.body
  let logs = await compareOrderData({ routeId, driverId }, { transactionId: customerOrderId, departmentId, userId, userName, userRole })
  customerQueries.updateOrderDetails(req.body, (err, data) => {
    if (err) res.status(500).json(dbError(err))
    else {
      if (logs.length) {
        departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
          if (err) console.log('log error', err)
          else console.log('log data', data)
        })
      }
      // departmenttransactionQueries.createDepartmentTransaction({ userId, description: "DC  Updated", transactionId: customerOrderId, departmentId: warehouseId, type: 'warehouse', subType: 'delivery' })
      res.json(data)
    }
  })
})

router.put('/updateCustomerStatus', (req, res) => {
  const { status, customerId } = req.body
  customerQueries.updateCustomerStatus(req.body, (err, data) => {
    if (err) res.status(500).json(dbError(err))
    else {
      customerQueries.updateCustomerDeliveriesStatus(req.body, (err, update) => {
        if (err) res.status(500).json(dbError(err))
        else {
          saveToCustomerOrderDetails(req.body.customerId, res)
          auditQueries.createLog({ userId, description: `Customer status changed to ${status == 1 ? 'Active' : 'Draft'}  by ${userRole} <b>(${userName})</b>`, customerId, type: "customer" })
          // res.json(UPDATEMESSAGE)
        }
      })
    }
  })
})

router.put('/updateDeliveryDetailsStatus', (req, res) => {
  customerQueries.updateCustomerDeliveryStatus(req.body, (err, update) => {
    if (err) res.status(500).json(dbError(err))
    else res.json(UPDATEMESSAGE)
  })
})

router.delete('/deleteCustomer/:customerId', (req, res) => {
  const { customerId } = req.params;
  customerQueries.deleteCustomer(customerId, (err, data) => {
    if (err) res.status(500).json(dbError(err))
    else {
      customerQueries.deleteCustomerDeliveries(customerId, (err, update) => {
        if (err) res.status(500).json(dbError(err))
        else {
          auditQueries.createLog({ userId, description: `Customer Deleted by ${userRole} <b>(${userName})</b>`, customerId, type: "customer" })
          res.json(DELETEMESSAGE)
        }
      })
    }
  })
})
router.get('/getActiveCustomersCount', (req, res) => {
  const result = {}
  const { type } = req.query
  let input = req.query
  customerQueries.getTotalCustomers(input, (err, active) => {
    if (err) res.status(500).json(dbError(err))
    else {
      result.totalCustomers = active.length ? active[0].totalCount : 0
      customerQueries.getTotalDistributors(input, (err, distributors) => {
        if (err) res.status(500).json(dbError(err))
        else result.totalDistributors = distributors.length ? distributors[0].totalCount : 0
      })
      customerQueries.getTotalActiveCorporateCustomers(input, (err, corporate) => {
        if (err) res.status(500).json(dbError(err))
        else {
          result.activeCorporateCustomers = corporate.length ? corporate[0].totalCount : 0
          customerQueries.getTotalActiveCorporateCustomersChange(input, (err, previousCorporate) => {
            if (err) res.status(500).json(dbError(err))
            else result.prevActiveCorporateCustomers = previousCorporate.length ? previousCorporate[0].totalCount : 0
          })
          customerQueries.getTotalActiveOtherCustomers(input, (err, other) => {
            if (err) res.status(500).json(dbError(err))
            else {
              result.activeOtherCustomers = other.length ? other[0].totalCount : 0
              customerQueries.getTotalActiveOtherCustomersChange(input, (err, previousOther) => {
                if (err) res.status(500).json(dbError(err))
                else if (previousOther.length) {
                  result.prevActiveOtherCustomers = previousOther.length ? previousOther[0].totalCount : 0
                  res.json(getCompareCustomersData(result, type))
                }
                else res.json(getCompareCustomersData(result, type))
              })
            }
          })
        }
      })
    }
  })
})

router.get('/getInactiveCustomersCount', (req, res) => {
  const result = {}
  const { type } = req.query
  let input = req.query;
  customerQueries.getTotalInActiveCustomers(input, (err, active) => {
    if (err) res.status(500).json(dbError(err))
    else {
      result.totalInactiveCustomers = active.length ? active[0].totalCount : 0
      customerQueries.getTotalInActiveDistributors(input, (err, inactiveDistributors) => {
        if (err) res.status(500).json(dbError(err))
        else result.totalInactiveDistributors = inactiveDistributors.length ? inactiveDistributors[0].totalCount : 0
      })
      customerQueries.getTotalPendingCorporateCustomers(input, (err, pendingCorporate) => {
        if (err) res.status(500).json(dbError(err))
        else {
          result.pendingCorporateCustomers = pendingCorporate.length ? pendingCorporate[0].totalCount : 0
          customerQueries.getTotalPendingOtherCustomers(input, (err, pendingOther) => {
            if (err) res.status(500).json(dbError(err))
            else {
              result.pendingOtherCustomers = pendingOther.length ? pendingOther[0].totalCount : 0
              customerQueries.getTotalDistributorsCount(input, (err, distributors) => {
                if (err) res.status(500).json(dbError(err))
                else {
                  result.activeDistributors = distributors.length ? distributors[0].totalCount : 0
                  customerQueries.getTotalDistributorsCountChange(input, (err, previousDistributors) => {
                    if (err) res.status(500).json(dbError(err))
                    else if (previousDistributors.length) {
                      result.prevActiveDistributors = previousDistributors.length ? previousDistributors[0].totalCount : 0
                      res.json(getCompareDistributorsData(result, type))
                    }
                    else {
                      res.json(getCompareDistributorsData(result, type))
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})
router.get('/generatePDF', (req, res) => {
  customerQueries.generatePDF("215", (err, items) => {
    if (err) res.status(500).json(dbError(err))
    else {
      let invoice = {
        items
      }
      createInvoice(invoice, "invoice1.pdf");
      res.json(items)
    }
  })
})
router.post('/updateDeliveryDetails', async (req, res) => {
  var deliveryDetails = req.body
  if (deliveryDetails.length) {
    let count = 0
    for (let i of deliveryDetails) {
      if (i.isNew == true) {
        saveDeliveryDays(i.deliveryDays).then(async (deliveryDays) => {
          let latLong = await getLatLongDetails({ Address1: i.address })
          let deliveryDetailsQuery = "insert  into DeliveryDetails (gstNo,location,address,phoneNumber,contactPerson,deliverydaysid,depositAmount,customer_Id,departmentId,isActive,gstProof,registeredDate,latitude,longitude,routeId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          var gstProof = i.gstProof ? i.test ? Buffer.from(i.gstProof, 'base64') : Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
          let registeredDate = new Date()
          let insertQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, deliveryDays.insertId, i.depositAmount, i.customer_Id, i.departmentId, i.isApproved, gstProof, registeredDate, latLong.latitude, latLong.longitude, i.routeId]
          db.query(deliveryDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              saveProductDetails(i.products, results.insertId, i.customer_Id).then(async (productDetails) => {
                if (count == deliveryDetails.length) {
                  let data = await getAddedDeliveryDetails(results.insertId)
                  updateWHDelivery(req)
                  auditQueries.createLog({ userId, description: `New Delivery details added by ${userRole} <b>(${userName})</b>`, customerId: i.customer_Id, type: "customer" })
                  res.json({ status: 200, message: "Delivery Details Updated Successfully", data });
                }
              })
            }
          });
        })
      } else {
        const { gstNo, deliveryLocation, address, phoneNumber, contactPerson, depositAmount, departmentId, isApproved, gstProof, routeId, deliveryDetailsId, customer_Id } = i
        const logs = await compareCustomerDeliveryData({ gstNo, deliveryLocation, address, phoneNumber, contactPerson, depositAmount, departmentId, isApproved, gstProof, routeId }, { deliveryDetailsId, customerId: customer_Id, userId, userRole, userName })
        updateDeliveryDays(i.deliveryDays, i.deliverydaysid).then(async (deliveryDays) => {
          let latLong = await getLatLongDetails({ Address1: i.address })
          let deliveryDetailsQuery = "UPDATE DeliveryDetails SET gstNo=?,location=?,address=?,phoneNumber=?,contactPerson=?,depositAmount=?,departmentId=?,isActive=?,gstProof=?,latitude=?,longitude=?,routeId=? WHERE deliveryDetailsId=" + i.deliveryDetailsId;
          var gstProof = i.gstProof ? i.test ? Buffer.from(i.gstProof, 'base64') : Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
          let updateQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, i.depositAmount, i.departmentId, i.isApproved, gstProof, latLong.latitude, latLong.longitude, i.routeId]
          db.query(deliveryDetailsQuery, updateQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              updateProductDetails(i.products, i.customer_Id).then(async (productDetails) => {
                if (count == deliveryDetails.length) {
                  let data = await getAddedDeliveryDetails(i.deliveryDetailsId)
                  updateWHDelivery(req)
                  res.json({ status: 200, message: "Delivery Details Updated Successfully", data });
                  if (logs.length) {
                    auditQueries.createLog(logs, (err, data) => {
                      if (err) console.log('log error', err)
                      else console.log('log data', data)
                    })
                  }

                  // auditQueries.createLog({ userId, description: `Delivery details Updated by ${userRole} <b>(${userName})</b>`, customerId: i.customer_Id, type: "customer" })
                }
                // res.json({ status: 200, message: "Delivery Details Updated Successfully", data: getAddedDeliveryDetails(i.deliveryDetailsId) });
              })
            }
          });
        })
      }
    }
  }
})
router.get("/getCustomerNames", (req, res) => {
  customerQueries.getCustomerNames((err, data) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(data)
    }
  })
});

router.get("/getCustomerBillingAddress/:customerId", (req, res) => {
  customerQueries.getCustomerBillingAddress(req.params.customerId, (err, data) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      if (data.length) {
        let result = data[0]
        result.isLocal = result.gstNo ? result.gstNo.startsWith('36') : false
        result.emailLabel = `${result.customerName} <${result.EmailId}>`
        res.json(result)
      }
      else res.json(data)
    }
  })
});

router.get("/getSalesPersons", (req, res) => {
  usersQueries.getSalesPersons((err, data) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json(data)
    }
  })
});

router.get('/customerDCDetails/:customerId', (req, res) => {
  var customerId = req.params.customerId;
  warehouseQueries.getCustomerDcDetails(customerId, (err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    res.send(JSON.stringify(results));
  });
});

router.post('/createQuote', (req, res) => {
  customerQueries.createQuote(req.body, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: "Quote created successfully" })
  });
});

router.get('/getQuotes', (req, res) => {
  customerQueries.getQuotes((err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    else res.json(results)
  });
});

// router.post('/createMembership', (req, res) => {
//   customerQueries.createMembershipCustomer(req.body, (err, results) => {
//     if (err) res.status(500).json(err.sqlMessage);
//     else res.json(results)
//   });
// });

router.post('/requestBusinessAccount', (req, res) => {
  customerQueries.createBusinessRequest(req.body, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json({ status: 200, message: "Your request received successfully" })
  });
});

router.get('/getBusinessRequests', (req, res) => {
  customerQueries.getBusinessRequests((err, results) => {
    if (err) res.status(500).json(err.sqlMessage);
    else res.json(results)
  });
});

router.post('/createMembership', async (req, res) => {
  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,Address2,contactperson,registeredDate,natureOfBussiness,latitude,longitude,customerType,pincode,contractPeriod) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let customerdetails = req.body;
  const { customerName, mobileNumber, EmailId, Address1, Address2, contactperson, natureOfBussiness = 'Others', pinCode, contractPeriod } = customerdetails
  Promise.all([getLatLongDetails(customerdetails)])
    .then(response => {
      const { latitude, longitude } = response[0]
      let registeredDate = customerdetails.registeredDate ? customerdetails.registeredDate : new Date()
      let insertQueryValues = [customerName, mobileNumber, EmailId, Address1, Address2, contactperson, registeredDate, natureOfBussiness, latitude, longitude, "Membership", pinCode, contractPeriod]
      db.query(customerDetailsQuery, insertQueryValues, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          let deliveryDetails = [{
            location: Address2, address: Address1,
            phoneNumber: mobileNumber, contactPerson: customerName,
            registeredDate, latitude, longitude
          }]
          customerdetails.deliveryDetails = deliveryDetails
          saveDeliveryDetails(results.insertId, customerdetails, res)
        }
      });
    })
});

const updateWHDelivery = (req) => {
  const { address, products, phoneNumber, driverId, routeId, contactPerson: customerName, customer_Id } = req.body[0]
  let obj = { address, phoneNumber, driverId, routeId, customer_Id, customerName, boxes1L: 0, boxes2L: 0, boxes300ML: 0, boxes500ML: 0, cans20L: 0 }
  products.map(product => {
    const { productName, noOfJarsTobePlaced } = product
    if (productName.startsWith('20')) obj.cans20L = noOfJarsTobePlaced
    if (productName.startsWith('2')) obj.boxes2L = noOfJarsTobePlaced
    if (productName.startsWith('1')) obj.boxes1L = noOfJarsTobePlaced
    if (productName.startsWith('500')) obj.boxes500ML = noOfJarsTobePlaced
    if (productName.startsWith('300')) obj.boxes300ML = noOfJarsTobePlaced
  })
  customerQueries.updateWHDeliveryDetails(obj, (err, update) => {
    if (err) console.log("Err", err)
    else {
      console.log("Update", update)
    }
  })
}
module.exports = router;
