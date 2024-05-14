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
        const { username, email, password } = req.body;

        if ((username || email) && password) {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (user && user.password == passwordEncrypt(password)) {
                if (user.isActive) {
                    /* SIMPLE TOKEN */

                    let tokenData = await Token.findOne({ userId: user.id });

                    if (!tokenData)
                        tokenData = await Token.create({
                            userId: user.id,
                            token: passwordEncrypt(user.id + Date.now())
                        });

                    /* SIMPLE TOKEN */

                    res.status(200).send({
                        error: false,
                        token: tokenData.token,
                        user
                    });
                } else {
                    res.errorStatusCode = 401;
                    throw new Error("This account is not active.");
                };
            } else {
                res.errorStatusCode = 401;
                throw new Error("Wrong username/email or password.");
            };
        } else {
            res.errorStatusCode = 401;
            throw new Error("Please enter username/email and password.");
        };
    },

    logout: async (req, res) => {
        const auth = req.headers?.authorization; // Token ...tokenKey...
        const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...']
        const result = await Token.deleteOne({ token: tokenKey[1] });

        res.send({
            error: false,
            message: "Token deleted. Logout was OK.",
            result
        });
    }

};