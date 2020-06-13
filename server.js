const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
const port = 8888;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const config=require('./config/config.js');




  app.use("/warehouse",require('./routes/warehouse.js'));  

  app.listen(port, () => console.log(`app listening on port ${port}!`))

