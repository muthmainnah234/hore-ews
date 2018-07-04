const express = require('express');
const router = express.Router();
const mqttHandler = require('../classes/mqtt_handler');
const Alarm = require('../models/Alarm');

router.post("/:type/:value", function(req, res) {
  const data = req.body;
  const { type, value } = req.params;

  if (type === 'region') {
    let param = {};
    if (value !== 'All') {
      param.region = value;
    } 
    Alarm.find(param, 'idEsp', (findErr, alarms) => {
      if (findErr) {
        return res.json({
          success: false,
          message: findErr.message || 'Error at finding alarm information',
          result: '',
        });
      } else if (alarms) {
        alarms.map((alarm) => {
          mqttHandler.sendMessage(`alarm/`+alarm.idEsp, data);
        });
        return res.json({
          success: true,
          message: 'Message sent',
          result: '',
        });
      }
    });
  } else if (type === 'id') {
    mqttHandler.sendMessage(`alarm/`+value, data);
    return res.json({
      success: true,
      message: 'Message sent',
      result: '',
    });
  }
  return res.json({
    success: false,
    message: 'Invalid property \'type\'',
    result: '',
  });
});

module.exports = router;
