const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var path = require('path');

const port = 8888;

const utilities = require('./routes/utilities.js');

//swagger ui configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

//Ware house rest services
app.use("/warehouse", require('./routes/warehouse.js'));

//Driver app Rest Services
app.use("/driver", require('./routes/driver.js'));

//Customer Rest Services
app.use("/customer", require('./routes/customer.js'));

//MotherPlat Rest Services
app.use("/motherPlant", require('./routes/motherPlant.js'));

//Permissions Rest Services
app.use("/roles", require('./routes/rolesAndPermissions'));

//Users Rest Services
app.use("/users", require('./routes/users'));


app.use("/bibo", require('./routes/loginAuthentication.js'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


process.on('uncaughtException', function (err) {
  console.log(err);
})


//app server to listen to the port
app.listen(port, () => console.log(`app listening on port ${port}!`))

