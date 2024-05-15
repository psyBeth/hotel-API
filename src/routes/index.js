'use strict'

const router = require('express').Router()

//? URL: /

// auth:
router.use('/auth', require('./auth'));

// user:
router.use('/users', require("./user"));

// token:
router.use('/tokens', require("./token"));

// reservation:

// room:
router.use('/rooms', require('./room'));

module.exports = router;