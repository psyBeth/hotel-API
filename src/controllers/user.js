'use strict'

const User = require("../models/user");

const Token = require("../models/token");

const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {

    list: async(req, res) => {
        const data = await User.find();
        res.status(200).send({
            error: false,
            data
        });
    },

    create: async(req, res) => {

    },

    read: async(req, res) => {

    },

    update: async(req, res) => {

    },

    delete: async(req, res) => {

    },

    login: async(req, res) => {

    },

    logout: async(req, res) => {

    }

};