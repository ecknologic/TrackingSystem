const QRCode = require('qrcode')
var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var fs = require("fs");
let filePath;

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
    if(results.length){
       qrText=results[0].adharNo + results[0].mobileNumber
    }
    res.send(JSON.stringify(qrText));

  });
});



router.post('/createCustomer', (req, res) => {

  let customerDetailsQuery = "insert  into customerdetails (customerName,mobileNumber,AlternatePhNo,EmailId,Address1,Address2,gstNo,contactperson,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,departmentId,deliveryDaysId,depositamount,isActive,qrCodeImage) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  console.log(req.body);

  let customerdetails = req.body;
  createQrCode(customerdetails.adharNo + customerdetails.mobileNumber).then(response => {
    let insertQueryValues = [customerdetails.customerName, customerdetails.mobileNumber, customerdetails.AlternatePhNo, customerdetails.EmailId, customerdetails.Address1, customerdetails.Address2, customerdetails.gstNo, customerdetails.contactperson, customerdetails.panNo, customerdetails.adharNo, customerdetails.registeredDate, customerdetails.invoicetype, customerdetails.natureOfBussiness, customerdetails.creditPeriodInDays, customerdetails.referredBy, customerdetails.departmentId, customerdetails.deliveryDaysId, customerdetails.depositamount, customerdetails.isActive, fs.readFileSync(response)]
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




module.exports = router;
