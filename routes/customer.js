const QRCode = require('qrcode')
var express = require('express');
var router = express.Router();
const db=require('../config/db.js')

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

 


  router.post('/createCustomer',(req,res)=>{

    let customerDetailsQuery="insert  into 'customerdetails'('customerName','mobileNumber','AlternatePhNo','EmailId','Address1','Address2','gstNo','contactperson','panNo','adharNo','registeredDate','invoicetype','natureOfBussiness','creditPeriodInDays','referredBy','departmentId','deliveryDaysId','depositamount','isActive') values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    console.log(req.body);

    let customerdetails=req.body;

    let insertQueryValues=[customerdetails.customerName,customerdetails.mobileNumber,customerdetails.AlternatePhNo,customerdetails.EmailId,customerdetails.Address1,customerdetails.Address2,customerdetails.gstNo,customerdetails.contactperson,customerdetails.panNo,customerdetails.adharNo,customerdetails.registeredDate,customerdetails.invoicetype,customerdetails.natureOfBussiness,customerdetails.creditPeriodInDays,customerdetails.referredBy,customerdetails.departmentId,customerdetails.deliveryDaysId,customerdetails.depositamount,customerdetails.isActive]
    db.query(customerDetailsQuery,insertQueryValues,(err,results)=>{

      console.log(insertQueryValues);

        if(err) throw err;
        else
          res.send("Record Inserted");

    });
    createQrCode(customerdetails.adharNo+customerdetails.mobileNumber);
});

    function createQrCode(qrcodeText){
        let filePath="assests/QRImages/"+qrcodeText+".png";
      QRCode.toFile(filePath, qrcodeText, {
        color: {
          dark: '#00F'  // Blue dots
        }
      }, function (err) {
        if (err) throw err
        console.log('done')
      })
    }

  


  module.exports = router;
