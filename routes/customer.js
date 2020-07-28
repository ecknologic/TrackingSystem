const QRCode = require('qrcode')
var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var fs = require("fs");
let filePath;
var NodeGeocoder = require('node-geocoder');
const opencage=require("../config/opencage.config.js");

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: opencage.apikey
});

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/getQrcode/:customerId', (req, res) => {
  let customerId = req.params.customerId;
  let query = "SELECT mobileNumber,adharNo FROM customerdetails WHERE customerId=" + customerId;
  let result = db.query(query, (err, results) => {
    let qrText;
    if (err) throw err;
    if (results.length) {
      qrText = results[0].adharNo + results[0].mobileNumber
    }
    res.send(JSON.stringify(qrText));

  });
});



router.post('/createCustomer', async (req, res) => {
  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,AlternatePhNo,EmailId,Address1,Address2,gstNo,contactperson,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,departmentId,deliveryDaysId,depositamount,isActive,qrCodeImage,latitude,longitude) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";


  let customerdetails = req.body;
  Promise.all([createQrCode(customerdetails.adharNo + customerdetails.mobileNumber), getLatLongDetails(customerdetails)])
    .then(response => {
      let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.AlternatePhNo, customerdetails.EmailId, customerdetails.Address1, customerdetails.Address2, customerdetails.gstNo, customerdetails.contactperson, customerdetails.panNo, customerdetails.adharNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.departmentId, customerdetails.deliveryDaysId, customerdetails.depositamount, customerdetails.isActive, fs.readFileSync(response[0]), response[1].latitude, response[1].longitude]
      db.query(customerDetailsQuery, insertQueryValues, (err, results) => {

        console.log(insertQueryValues);

        if (err) throw err;
        else
          res.send("Record Inserted");

      });
    })
});

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
        console.log('done');
        resolve(filePath);
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
