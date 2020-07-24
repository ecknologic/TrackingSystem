const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
const port = 8888;

const utilities=require('./routes/utilities.js');

//swagger ui configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Tracking System Rest APIs",
      version: "1.0.0",
      description:
        "Node Js rest services for the tracking system which includes warehouse,driver and motherplant modules",

      contact: {
        name: "Swagger",
        url: "https://swagger.io"
      }
    },
    servers: [
      {
        url: "http://localhost:8888/"
      }
    ]
  },
  apis: ['./routes/*.js']
};
const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve);
app.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true
  })
);


//Ware house rest services
  app.use("/warehouse",require('./routes/warehouse.js'));  

  //Driver app Rest Services
  app.use("/driver",require('./routes/driver.js'));  

  //Customer Rest Services
  app.use("/customer",require('./routes/customer.js'));  


  app.use("/bibo",require('./routes/loginAuthentication.js'));  

  app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});





  //app server to listen to the port
  app.listen(port, () => console.log(`app listening on port ${port}!`))

