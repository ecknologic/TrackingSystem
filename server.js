const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
const port = 8888;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//Ware house rest services
  app.use("/warehouse",require('./routes/warehouse.js'));  

  app.use("/bibo",require('./routes/utilities.js'));  



  //app server to listen to the port
  app.listen(port, () => console.log(`app listening on port ${port}!`))

