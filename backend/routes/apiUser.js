const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * GET /user
 * To get all available users.
 */
router.get('/', (req, res) => {
  User.find((findErr, users) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding users',
        result: [],
      });
    }
    if (users) {
      return res.json({
        success: true,
        message: 'Listing all users',
        result: users,
      });
    }
    return res.json({
      success: false,
      message: 'There is no user',
      result: [],
    });
  });
}); 

/**
 * POST /user
 * To create new user.
 */
router.post('/', (req, res) => {
  const { name, username, password, email } = req.body;
  const user = new User({
    name,
    username, 
    password, 
    email,
  });
  user.save((saveErr) => {
    if (saveErr) {
      return res.json({
        success: false,
        message: saveErr.message || 'User has not been saved',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'User was succesfully saved',
      result: user,
    });
  });
});

/**
 * GET /user/:id
 * To get a user with spesific id.
 */
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (findErr, user) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding user',
        result: {},
      });
    }
    if (user) {
      return res.json({
        success: true,
        message: 'User was found',
        result: user,
      });
    }
    return res.json({
      success: false,
      message: 'User was not found',
      result: {},
    });
  });
});

/**
 * DELETE /user
 * To delete a user with spesific id.
 */
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (findErr, deletedUser) => {
    if (findErr) {
      return res.json({
        success: false,
        message: findErr.message || 'Error at finding and deleting user',
        result: {},
      });
    }
    if (!deletedUser) {
      return res.json({
        success: false,
        message: 'User not found',
        result: {},
      });
    }
    return res.json({
      success: true,
      message: 'User was successfully deleted',
      result: deletedUser,
    });
  });
});

/**
 * PUT /user
 * To update an existing user with spesific id.
 */
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (updateErr, updatedUser) => {
    if (updateErr) {
      return res.json({
        success: false,
        message: updateErr.message || 'Error at updating user',
        result: {},
      });
    }
    if (!updatedUser) {
      return res.json({
        success: false,
        message: 'User was not found',
        result: {},
      });
    }
    return res.json({
      success: false,
      message: 'User was successfully updated',
      result: updatedUser,
    });
  });
});

module.exports = router;
