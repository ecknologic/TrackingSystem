// config.js
const config = {

  db: {
    host: process.env.HOST || 'tracking-system.cnz4ify3r0by.ap-south-1.rds.amazonaws.com',
    // host: process.env.HOST || '100.25.207.145',
    dbName: process.env.DB_NAME || 'trackingsystem',
    user: process.env.USER_NAME || 'admin',
    password: process.env.PASSWORD || 'gptmFGgWdyEbymqSw2PX'
    // password: process.env.PASSWORD || 'Google@19'

    // host: process.env.HOST || '13.235.230.90',
    // password: process.env.PASSWORD || 'Acer12345!'
    // user: process.env.USER_NAME || 'root',
    
  }
};


// SELECT SUM(co.20LCans)/COUNT(*) expectedSale,SUM(co.20LCans)/COUNT(*)*10*co.price20L invoiceAmount,c.salesAgent,u.userName FROM customerorderdetails co 
// INNER JOIN customerdetails c ON co.existingCustomerId=c.customerId LEFT JOIN usermaster u ON c.salesAgent=u.userId
//  WHERE co.customerType='internal' AND deliveredDate BETWEEN '2021-05-01' AND '2021-05-10' GROUP BY
//  c.salesAgent,co.price20L
 
//Expected sale per days working 
// SELECT SUM(co.20LCans)/COUNT(*) 20LCans,c.salesAgent,u.userName FROM customerorderdetails co 
// INNER JOIN customerdetails c ON co.existingCustomerId=c.customerId LEFT JOIN usermaster u ON c.salesAgent=u.userId
//  WHERE co.customerType='internal' AND deliveredDate BETWEEN '2021-05-01' AND '2021-05-10' GROUP BY
//  c.salesAgent 
  
//   //working
// SELECT SUM(co.20LCans)/COUNT(*) 20LCans,co.existingCustomerId FROM customerorderdetails co 
//  WHERE co.customerType='internal' AND deliveredDate BETWEEN '2021-05-01' AND '2021-05-10' GROUP BY co.existingCustomerId

module.exports = config;