const express = require('express');
const router = express.Router();
const Alarm = require('../models/Alarm');
const Phone = require('../models/Phone');
const mqttClient = require('../app');

router.post("/:type/:value", function(req, res) {
  const alarmData = JSON.stringify(req.body);
  const { type, value } = req.params;

  if (type === 'region') {
    let param = {};
    if (value !== 'All') {
      param.region = value;
    } 

    Phone.find(param, 'phonenumber', (phoneErr, phones) => {
      if (phoneErr) {
        return res.json({
          success: false,
          message: findErr.message || 'Error at finding phone numbers',
          result: '',
        });
      } else if (phones) {
        const arrData = Array.from(phones, item => { return item.phonenumber });
        const phoneData = {
          phoneNumbers: arrData
        }
        mqttClient.sendMessage('hore-ews/sms', JSON.stringify(phoneData));

        Alarm.find(param, 'idEsp', (findErr, alarms) => {
          if (findErr) {
            return res.json({
              success: false,
              message: findErr.message || 'Error at finding alarm information',
              result: '',
            });
          } else if (alarms) {
            alarms.map((alarm) => {
              mqttClient.sendMessage(`hore-ews/alarm/`+alarm.idEsp, alarmData);
            });
            return res.json({
              success: true,
              message: 'Multiple messages sent',
              result: '',
            });
          }
        });
      }
    });
  } else if (type === 'id') {
    mqttClient.sendMessage(`hore-ews/alarm/`+value, alarmData);
    return res.json({
      success: true,
      message: 'Message sent',
      result: '',
    });
  } else {
    return res.json({
      success: false,
      message: 'Invalid property \'type\'',
      result: '',
    });
  }
});

module.exports = router;
