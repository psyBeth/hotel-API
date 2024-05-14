'use strict'

const router = require('express').Router()

//? URL: /

// auth:

// user:
router.use('/users', require("./user"));

// token:
router.use('/tokens', require("./token"));

// reservation:

// room:


module.exports = router;