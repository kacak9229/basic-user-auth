// Main libraries
var express 	= require('express');
var logger 		= require('morgan');
var bodyParser 	= require('body-parser');
var mongoose  	= require('mongoose');
var config 		= require('./config');

var app 		= express();

// Middlewares for parsing a json object and logger for terminal
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

// Connecting to a database
mongoose.connect(config.database, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
	}
});

// requiring the api object
var api = require('./app/routes/api');
app.use('/api', api);

// Serving index.html on any url routes (For any client-side -->  React, Angular)
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// Listening on port 8080
app.listen(config.port, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected on port " + config.port);
	}
});