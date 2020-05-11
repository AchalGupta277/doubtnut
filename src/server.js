let express = require("express");
let app = express();
const bodyParser = require('body-parser');
var cron = require('node-cron');
const config = require('dotenv').config();

// project dependency
const cronServices = require('./cron');
const routes = require('./routes');

// middlewares
app.use(bodyParser.json({extended: true}))
app.use('/', routes);

app.listen(process.env.PORT, function(){
    console.log(` App started on port ${process.env.PORT}`);
});