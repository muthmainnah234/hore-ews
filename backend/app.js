const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mqttHandler = require('./classes/mqtt_handler');

const mqttClient = new mqttHandler();
mqttClient.connect();

module.exports = mqttClient;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-ALlow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/phone', require('./routes/apiPhone'));
app.use('/alarm', require('./routes/apiAlarm'));
app.use('/user', require('./routes/apiUser'));
app.use('/mqtt', require('./routes/apiMqtt'));

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function () {
  console.log('Note app server listening on port ' + app.get('port') + '!');
});

/* Connect Mongo DB */
mongoose.connect('mongodb://127.0.0.1/hore-ews');

mongoose.connection.on('error', (err) => {
  console.error(err);
});

