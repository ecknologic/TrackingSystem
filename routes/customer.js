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
router.post('/uploadphoto', (req, res) => {
  upload(req, res, function (err, data) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    Object.keys(req.files).forEach(function (k) {
      console.log(k + ' - ' + req.files[k]);
    });

    req.files.forEach(file => {
      console.log(file.path);
    })
    let idproofdetailsquery = "insert  into customerDocStore(idProof_frontside,idProof_backside) values(?,?)";
    let insertQueryValues = [fs.readFileSync(req.files[0].path), fs.readFileSync(req.files[1].path)]
    db.query(idproofdetailsquery, insertQueryValues, (err, results) => {
      // console.log("fdf", insertQueryValues);
      if (err) res.send(err);
      else {
        // console.log("JSJS", JSON.stringify(results));
        res.send("Record Inserted");

      }
    })
  });
})
router.get('/getPhoto', (req, res) => {
  let query = "SELECT * FROM customerDocStore";
  // let query = "SELECT * FROM customerdetails WHERE customerId=" + customerId;
  db.query(query, (err, results) => {
    if (err) res.send(err);
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
    if (err) res.send(err);
    if (results.length) {
      qrText = results[0].adharNo + results[0].mobileNumber
    }
    res.send(JSON.stringify(qrText));

  });
});
router.get('/getCustomers', (req, res) => {
  let query = "SELECT * from customerdetails";
  db.query(query, (err, results) => {
    if (err) res.send(err);
    res.send(JSON.stringify(results));

  });
});



router.post('/createCustomer', async (req, res) => {
  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,AlternatePhNo,EmailId,Address1,Address2,gstNo,contactperson,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,departmentId,deliveryDaysId,depositamount,isActive,qrcodeId,latitude,longitude,shippingAddress,shippingContactPerson,shippingContactNo,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  // let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,gstNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,qrcodeId,latitude,longitude,customerType,organizationName,createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let customerdetails = req.body;
  Promise.all([createQrCode(customerdetails.adharNo + customerdetails.mobileNumber), getLatLongDetails(customerdetails)])
    .then(response => {
      let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.AlternatePhNo, customerdetails.EmailId, customerdetails.Address1, customerdetails.Address2, customerdetails.gstNo, customerdetails.contactperson, customerdetails.panNo, customerdetails.adharNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.departmentId, customerdetails.deliveryDaysId, customerdetails.depositamount, customerdetails.isActive, response[0], response[1].latitude, response[1].longitude, customerdetails.shippingAddress, customerdetails.shippingContactPerson, customerdetails.shippingContactNo, customerdetails.customerType, customerdetails.organizationName, customerdetails.createdBy]
      // let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.EmailId, customerdetails.Address1, customerdetails.gstNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.isActive, response[0], response[1].latitude, response[1].longitude, customerdetails.customerType, customerdetails.organizationName, customerdetails.createdBy]
      db.query(customerDetailsQuery, insertQueryValues, (err, results) => {
        console.log(insertQueryValues);
        if (err) res.send(err);
        else {
          saveDeliveryDetails(results.insertId, customerdetails, res)
        }
        // res.send("Record Inserted");
      });
    })
});
const saveDeliveryDetails = (customerId, customerdetails, res) => {
  return new Promise((resolve, reject) => {
    if (customerdetails.deliveryDetails.length) {
      let count = 0
      for (let i of customerdetails.deliveryDetails) {
        saveDeliveryDays(i.deliveryDays).then(deliveryDays => {
          let deliveryDetailsQuery = "insert  into DeliveryDetails (gstNo,address,phoneNumber,contactPerson,deliverydaysid,depositAmount,customer_Id) values(?,?,?,?,?,?,?)";
          let insertQueryValues = [i.gstNo, i.address, i.phoneNumber, i.contactPerson, deliveryDays.insertId, i.depositAmount, customerId]
          db.query(deliveryDetailsQuery, insertQueryValues, (err, results) => {
            if (err) res.send(err);
            else {
              count++
              saveProductDetails(i.products, results.insertId).then(productDetails => {
                console.log(count, customerdetails.deliveryDetails.length)
                if (count == customerdetails.deliveryDetails.length) res.send("Records Inserted");
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
      if (err) res.send(err);
      else resolve(results)
    });
  })
}
const saveProductDetails = (products, deliveryDetailsId) => {
  return new Promise((resolve, reject) => {
    if (products.length) {
      for (let i of products) {
        let deliveryProductsQuery = "insert  into DeliveryProducts (deliverydetailsId,productid) values(?,?)";
        let insertQueryValues = [deliveryDetailsId, i]
        db.query(deliveryProductsQuery, insertQueryValues, (err, results) => {
          if (err) res.send(err);
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
          console.log("fdf", insertQueryValues);
          if (err) res.send(err);
          else {
            console.log("JSJS", JSON.stringify(results))
            resolve(results.insertId);
          }
        })
      }
    })
  })

}

const getLatLongDetails = (req) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode(req.Address1 + "," + req.Address2, function (err, res) {
      if (err) reject(err)
      else resolve({
        latitude: res.length ? res[0].latitude : "",
        longitude: res.length ? res[0].longitude : ""
      })
    });
  })
}

// router.get("/getLongitudeandLatitude/:address", (req, response) => {
//   geocoder.geocode(req.params.address, function (err, res) {
//     response.send("lattitue:::" + res[0].latitude + "longitude:::" + res[0].longitude);
//   });
// });



module.exports = router;
