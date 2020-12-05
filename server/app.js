var express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");

//const models = require('./models');
const { sequelize } = require("./models");

const config = require("./config/config.json")[process.env.NODE_ENV || "development"];
const viewPath = config.path;

var app = express();
app.use(bodyParser.json({
  limit: '200mb'
}));
app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: false
}));

app.use("/", express.static(path.join(__dirname, viewPath.index)));

var port = config.port;

//sequelize.sync();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/rest",require("./routes"));

app.listen(port, (err) => {
    if (err) throw err;
    console.log("Server ready on http://localhost:" + port);
});



module.exports = app;
