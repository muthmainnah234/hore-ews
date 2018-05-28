const express = require('express');
const router = express.Router();
const Alarm = require('../models/Alarm');

/**
 * GET /alarm
 * To get all available alarms.
 */
router.get('/', (req, res) => {
  Alarm.find((findErr, alarms) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding alarms',
        result: [],
      });
    }
    if (alarms) {
      return res.json({
        success: true,
        message: 'Listing all alarms',
        result: alarms,
      });
    }
    return res.json({
      success: false,
      message: 'There is no alarm',
      result: [],
    });
  });
}); 

/**
 * POST /alarm
 * To create new alarm.
 */
router.post('/', (req, res) => {
  const { region, latitude, longitude, connected, powerON, alarmON } = req.body;
  const alarm = new Alarm({
    region, 
    latitude, 
    longitude,
    connected, 
    powerON, 
    alarmON,
  });
  alarm.save((saveErr) => {
    if (saveErr) {
      return res.json({
        success: false,
        message: saveErr.message || 'Alarm has not been saved',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'Alarm was succesfully saved',
      result: alarm,
    });
  });
});

/**
 * GET /alarm/:id
 * To get a alarm with spesific id.
 */
router.get('/:id', (req, res) => {
  Alarm.findById(req.params.id, (findErr, alarm) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding alarm',
        result: {},
      });
    }
    if (alarm) {
      return res.json({
        success: true,
        message: 'Alarm was found',
        result: alarm,
      });
    }
    return res.json({
      success: false,
      message: 'Alarm was not found',
      result: {},
    });
  });
});

/**
 * DELETE /alarm
 * To delete a alarm with spesific id.
 */
router.delete('/:id', (req, res) => {
  Alarm.findByIdAndRemove(req.params.id, (findErr, deletedAlarm) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding and deleting alarm',
        result: {},
      });
    }
    if (!deletedAlarm) {
      return res.json({
        success: false,
        message: 'Alarm not found',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'Alarm was successfully deleted',
      result: deletedAlarm,
    });
  });
});

/**
 * PUT /alarm
 * To update an existing alarm with spesific id.
 */
router.put('/:id', (req, res) => {
  Alarm.findByIdAndUpdate(req.params.id, req.body, { new: true }, (updateErr, updatedAlarm) => {
    if (updateErr) {
      return res.json({
        success: false,
        message: updateErr.message || 'Error at updating alarm',
        result: {},
      });
    }
    if (!updatedAlarm) {
      return res.json({
        success: false,
        message: 'Alarm was not found',
        result: {},
      });
    }
    return res.json({
      success: false,
      message: 'Alarm was successfully updated',
      result: updatedAlarm,
    });
  });
});

module.exports = router;
