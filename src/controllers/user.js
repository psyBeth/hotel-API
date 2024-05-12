'use strict'

const User = require("../models/user");

const Token = require("../models/token");

const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {

    list: async (req, res) => {
        const data = await User.find();
        res.status(200).send({
            error: false,
            data
        });
    },

    create: async (req, res) => {
        const data = await User.create(req.body);
        res.status(201).send({
            error: false,
            body: req.body,
            data: data,
        });
    },

    read: async (req, res) => {
        const data = await User.findOne({ _id: req.params.userId });
        res.status(202).send({
            error: false,
            data: data,
        });
    },

    update: async (req, res) => {
        const data = await User.updateOne({ _id: req.params.userId }, req.body);
        const newdata = await User.find({ _id: req.params.userId });
        res.status(202).send({
            error: false,
            data: data,
            newdata: newdata,
        });
    },

    delete: async (req, res) => {
        const data = await User.deleteOne({ _id: req.params.userId });
        res.status(data.deletedCount >= 1 ? 204 : 404).send({
            error: !data.deletedCount,
            data
        });
    },

    login: async (req, res) => {

    },

    logout: async (req, res) => {

    }

};