const express = require('express');
const router = express.Router();
const Phone = require('../models/Phone');

/**
 * GET /phone
 * To get all available phones.
 */
router.get('/', (req, res) => {
  Phone.find((findErr, phones) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding phones',
        result: [],
      });
    }
    if (phones) {
      return res.json({
        success: true,
        message: 'Listing all phones',
        result: phones,
      });
    }
    return res.json({
      success: false,
      message: 'There is no phone',
      result: [],
    });
  });
}); 

/**
 * POST /phone
 * To create new phone.
 */
router.post('/', (req, res) => {
  const { name, phonenumber, region } = req.body;
  const phone = new Phone({
    name,
    phonenumber, 
    region,
  });
  phone.save((saveErr) => {
    if (saveErr) {
      return res.json({
        success: false,
        message: saveErr.message || 'Phone has not been saved',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'Phone was succesfully saved',
      result: phone,
    });
  });
});

/**
 * GET /phone/:id
 * To get a phone with spesific id.
 */
router.get('/:id', (req, res) => {
  Phone.findById(req.params.id, (findErr, phone) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding phone',
        result: {},
      });
    }
    if (phone) {
      return res.json({
        success: true,
        message: 'Phone was found',
        result: phone,
      });
    }
    return res.json({
      success: false,
      message: 'Phone was not found',
      result: {},
    });
  });
});

/**
 * DELETE /phone
 * To delete a phone with spesific id.
 */
router.delete('/:id', (req, res) => {
  Phone.findByIdAndRemove(req.params.id, (findErr, deletedPhone) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding and deleting phone',
        result: {},
      });
    }
    if (!deletedPhone) {
      return res.json({
        success: false,
        message: 'Phone not found',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'Phone was successfully deleted',
      result: deletedPhone,
    });
  });
});

/**
 * PUT /phone
 * To update an existing phone with spesific id.
 */
router.put('/:id', (req, res) => {
  Phone.findByIdAndUpdate(req.params.id, req.body, { new: true }, (updateErr, updatedPhone) => {
    if (updateErr) {
      return res.json({
        success: false,
        message: updateErr.message || 'Error at updating phone',
        result: {},
      });
    }
    if (!updatedPhone) {
      return res.json({
        success: false,
        message: 'Phone was not found',
        result: {},
      });
    }
    return res.json({
      success: false,
      message: 'Phone was successfully updated',
      result: updatedPhone,
    });
  });
});

module.exports = router;
