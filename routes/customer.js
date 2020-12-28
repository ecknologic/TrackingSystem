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
  let query = "SELECT * from customerdetails";
  db.query(query, (err, results) => {
    if (err) res.status(500).json(err);
    res.send(JSON.stringify(results));
  });
});



router.post('/createCustomer', async (req, res) => {
  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,AlternatePhNo,EmailId,Address1,Address2,gstNo,contactperson,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,departmentId,deliveryDaysId,depositamount,isActive,qrcodeId,latitude,longitude,shippingAddress,shippingContactPerson,shippingContactNo,customerType,organizationName,createdBy,customer_id_proof,idProofType) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let customerdetails = req.body;
  Promise.all([createQrCode('idProof' + customerdetails.mobileNumber), getLatLongDetails(customerdetails), uploadImage(req)])
    .then(response => {
      let registeredDate = customerdetails.registeredDate ? customerdetails.registeredDate : new Date()
      let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.AlternatePhNo, customerdetails.EmailId, customerdetails.Address1, customerdetails.Address2, customerdetails.gstNo, customerdetails.contactperson, customerdetails.panNo, customerdetails.adharNo, registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.departmentId, customerdetails.deliveryDaysId, customerdetails.depositamount, customerdetails.isActive, response[0], response[1].latitude, response[1].longitude, customerdetails.shippingAddress, customerdetails.shippingContactPerson, customerdetails.shippingContactNo, customerdetails.customertype, customerdetails.organizationName, customerdetails.createdBy, response[2], customerdetails.idProofType]
      db.query(customerDetailsQuery, insertQueryValues, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          saveDeliveryDetails(results.insertId, customerdetails, res)
        }
      });
    })
});
const saveDeliveryDetails = (customerId, customerdetails, res) => {
  return new Promise((resolve, reject) => {
    if (customerdetails.deliveryDetails.length) {
      let count = 0
      for (let i of customerdetails.deliveryDetails) {
        saveDeliveryDays(i.deliveryDays).then(deliveryDays => {
          let deliveryDetailsQuery = "insert  into DeliveryDetails (gstNo,location,address,phoneNumber,contactPerson,deliverydaysid,depositAmount,customer_Id,departmentId,isActive,gstProof,registeredDate) values(?,?,?,?,?,?,?,?,?,?,?,?)";
          var gstProof = Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
          let registeredDate = new Date()
          let insertQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, deliveryDays.insertId, i.depositAmount, customerId, i.departmentId, i.isActive, gstProof, registeredDate]
          db.query(deliveryDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              saveProductDetails(i.products, results.insertId, customerId).then(productDetails => {
                // console.log(count, customerdetails.deliveryDetails.length)
                if (count == customerdetails.deliveryDetails.length) res.json({ status: 200, message: "Customer Created Successfully" });
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
const updateProductDetails = (products) => {
  return new Promise((resolve, reject) => {
    if (products.length) {
      for (let i of products) {
        let deliveryProductsQuery = "UPDATE customerproductdetails SET noOfJarsTobePlaced=?,productPrice=?,productName=? where id=" + i.productId;
        let updateQueryValues = [i.noOfJarsTobePlaced, i.productPrice, i.productName]
        db.query(deliveryProductsQuery, updateQueryValues, (err, results) => {
          if (err) reject(err);
          else resolve(results)
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



router.get("/getCustomerDetails/:creatorId", (req, res) => {
  let customerDetailsQuery = "SELECT c.organizationName,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.createdBy=?  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
  db.query(customerDetailsQuery, [req.params.creatorId], (err, results) => {
    if (err) res.json({ status: 500, message: err.sqlMessage });
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});
router.get("/getCustomerDetailsById/:customerId", (req, res) => {
  let customerDetailsQuery = "SELECT customerId,customerName,mobileNumber,EmailId,Address1,gstNo,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,customertype,organizationName,idProofType,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId WHERE c.customerId=" + req.params.customerId
  db.query(customerDetailsQuery, (err, results) => {
    if (err) res.status(500).json(err);
    else {
      res.json({ status: 200, statusMessage: "Success", data: results })
    }
  })
});
router.get("/getCustomerDeliveryDetails/:customerId", (req, res) => {
  // let customerDetailsQuery = "SELECT * from customerdetails c  WHERE c.customerId=?";
  // db.query(customerDetailsQuery, [req.params.customerId], (err, results) => {
  getDeliveryDetails(req.params.customerId).then(response => {
    // if (err) res.status(500).json(err);
    // else {
    const customerDeliveryDetails = [{}];
    customerDeliveryDetails[0]["deliveryDetails"] = response;

    //var customerDeliveryDetails = results.concat(JSON.stringify(response));

    res.json({ status: 200, statusMessage: "Success", data: customerDeliveryDetails })
  })
  // });


  // })
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
// router.get("/getLongitudeandLatitude/:address", (req, response) => {
//   geocoder.geocode(req.params.address, function (err, res) {
//     response.send("lattitue:::" + res[0].latitude + "longitude:::" + res[0].longitude);
//   });
// });
// router.get('/test', (req, res) => {
const getAddedDeliveryDetails = (deliveryDetailsId) => {
  return getDeliveryDetails(null, deliveryDetailsId)
}
// })
const getDeliveryDetails = (customerId, deliveryDetailsId) => {
  return new Promise((resolve, reject) => {
    let deliveryDetailsQuery = "SELECT d.*,d.location AS deliveryLocation,r.departmentName,json_object('SUN',cd.SUN,'MON',cd.MON,'TUE',cd.TUE,'WED',cd.WED,'THU',cd.THU,'FRI',cd.FRI,'SAT',cd.SAT) as 'deliveryDays' " +
      /*  "concat(CASE WHEN cd.sun=1 THEN 'Sunday,' ELSE '' END,"+
       "CASE WHEN cd.mon=1 THEN 'Monday,' ELSE '' END,"+
       "CASE WHEN cd.tue=1 THEN 'Tuesday,' ELSE '' END,"+
       "CASE WHEN cd.wed=1 THEN 'Wednesday,' ELSE '' END,"+
       "CASE WHEN cd.thu=1 THEN 'Thursday,' ELSE '' END,"+
       "CASE WHEN cd.fri=1 THEN 'Friday,' ELSE '' END,"+
       "CASE WHEN cd.sat=1 THEN 'Saturday,' ELSE '' END) AS 'Delivery Days'"+ */
      "FROM DeliveryDetails d INNER JOIN customerdeliverydays cd ON cd.deliveryDaysId=d.deliverydaysid INNER JOIN departmentmaster r ON r.departmentId=d.departmentId WHERE d.customer_Id=? OR d.deliveryDetailsId=?  ORDER BY d.registeredDate DESC;";
    db.query(deliveryDetailsQuery, [customerId, deliveryDetailsId], (err, results) => {
      if (err) reject(err)
      else {
        if (results.length) {
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
        } else resolve([])
      }
    });
  });
}

const customerProductDetails = (deliveryDetailsId) => {
  return new Promise((resolve, reject) => {
    let customerProductDetailsQuery = "SELECT cp.productName,cp.productPrice,cp.noOfJarsTobePlaced,cp.id AS productId FROM customerproductdetails cp WHERE deliveryDetailsId=?";
    db.query(customerProductDetailsQuery, [deliveryDetailsId], (err, results) => {
      if (err) reject(err)
      else {
        resolve(results)
      }
    });
  });
}

router.post('/updateCustomer', async (req, res) => {
  let customerdetails = req.body;
  let customerDetailsQuery = "UPDATE customerdetails SET customerName=?,mobileNumber=?,AlternatePhNo=?,EmailId=?,Address1=?,Address2=?,gstNo=?,contactperson=?,panNo=?,adharNo=?,invoicetype=?,natureOfBussiness=?,creditPeriodInDays=?,referredBy=?,departmentId=?,deliveryDaysId=?,depositamount=?,isActive=?,latitude=?,longitude=?,shippingAddress=?,shippingContactPerson=?,shippingContactNo=?,customerType=?,organizationName=?,idProofType=? WHERE customerId=" + customerdetails.customerId;
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  Promise.all([getLatLongDetails(customerdetails), updateProofs(req)])
    .then(response => {
      let updateQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.AlternatePhNo, customerdetails.EmailId, customerdetails.Address1, customerdetails.Address2, customerdetails.gstNo, customerdetails.contactperson, customerdetails.panNo, customerdetails.adharNo, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.departmentId, customerdetails.deliveryDaysId, customerdetails.depositamount, customerdetails.isActive, response[0].latitude, response[0].longitude, customerdetails.shippingAddress, customerdetails.shippingContactPerson, customerdetails.shippingContactNo, customerdetails.customertype, customerdetails.organizationName, customerdetails.idProofType]
      // let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.EmailId, customerdetails.Address1, customerdetails.gstNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.isActive, response[0], response[1].latitude, response[1].longitude, customerdetails.customerType, customerdetails.organizationName, customerdetails.createdBy]
      db.query(customerDetailsQuery, updateQueryValues, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          res.json({ status: 200, message: 'Customer Updated successfully' })
        }
      });
    })
});
router.post('/updateDeliveryDetails', (req, res) => {
  var deliveryDetails = req.body
  if (deliveryDetails.length) {
    let count = 0
    for (let i of deliveryDetails) {
      if (i.isNew == true) {
        saveDeliveryDays(i.deliveryDays).then(deliveryDays => {
          let deliveryDetailsQuery = "insert  into DeliveryDetails (gstNo,location,address,phoneNumber,contactPerson,deliverydaysid,depositAmount,customer_Id,departmentId,isActive,gstProof,registeredDate) values(?,?,?,?,?,?,?,?,?,?,?,?)";
          var gstProof = i.gstProof ? i.test ? Buffer.from(i.gstProof, 'base64') : Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
          let registeredDate = new Date()
          let insertQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, deliveryDays.insertId, i.depositAmount, i.customer_Id, i.departmentId, i.isActive, gstProof, registeredDate]
          db.query(deliveryDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              saveProductDetails(i.products, results.insertId, i.customer_Id).then(async (productDetails) => {
                if (count == deliveryDetails.length) {
                  let data = await getAddedDeliveryDetails(results.insertId)
                  res.json({ status: 200, message: "Delivery Details Updated Successfully", data });
                }
              })
            }
          });
        })
      } else {
        updateDeliveryDays(i.deliveryDays, i.deliverydaysid).then(deliveryDays => {
          let deliveryDetailsQuery = "UPDATE DeliveryDetails SET gstNo=?,location=?,address=?,phoneNumber=?,contactPerson=?,depositAmount=?,departmentId=?,isActive=?,gstProof=? WHERE deliveryDetailsId=" + i.deliveryDetailsId;
          var gstProof = i.gstProof ? i.test ? Buffer.from(i.gstProof, 'base64') : Buffer.from(i.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64') : null
          let updateQueryValues = [i.gstNo, i.deliveryLocation, i.address, i.phoneNumber, i.contactPerson, i.depositAmount, i.departmentId, i.isActive, gstProof]
          db.query(deliveryDetailsQuery, updateQueryValues, (err, results) => {
            if (err) res.json({ status: 500, message: err.sqlMessage });
            else {
              count++
              updateProductDetails(i.products).then(async (productDetails) => {
                if (count == deliveryDetails.length) {
                  let data = await getAddedDeliveryDetails(i.deliveryDetailsId)
                  res.json({ status: 200, message: "Delivery Details Updated Successfully", data });
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
module.exports = router;
