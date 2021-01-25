const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var path = require('path');
const { checkDepartmentExists, checkUserExists } = require('./utils/functions')

const port = 8888;

const utilities = require('./routes/utilities.js');

//swagger ui configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


app.use(cors());
app.use(bodyParser.urlencoded({ limit: '60mb', extended: true }));

app.use(bodyParser.json({ limit: '60mb', extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});



//Ware house rest services
app.use("/warehouse", checkUserExists, checkDepartmentExists, require('./routes/warehouse.js'));

//Driver app Rest Services
app.use("/driver", require('./routes/driver.js'));

//Customer Rest Services
app.use("/customer", checkUserExists, require('./routes/customer.js'));

//MotherPlant Rest Services
app.use("/motherPlant", checkUserExists, checkDepartmentExists, require('./routes/motherPlant.js'));

//Permissions Rest Services
app.use("/roles", require('./routes/rolesAndPermissions'));

//Users Rest Services
app.use("/users", checkUserExists, require('./routes/users'));

//Products Rest Services
app.use("/products", checkUserExists, require('./routes/products'));

//Products Rest Services
app.use("/distributor", checkUserExists, require('./routes/distributor'));


app.use("/bibo", require('./routes/loginAuthentication.js'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  res.json({ status: 404, message: "API Not Found" });
});
process.on('uncaughtException', function (err) {
  console.log(err);
})


//app server to listen to the port
app.listen(port, () => console.log(`app listening on port ${port}!`))

