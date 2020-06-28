const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
const port = 8888;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(new Date());

//Ware house rest services
  app.use("/warehouse",require('./routes/warehouse.js'));  

  app.use("/bibo",require('./routes/loginAuthentication.js'));  

  app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});

  //app server to listen to the port
  app.listen(port, () => console.log(`app listening on port ${port}!`))

