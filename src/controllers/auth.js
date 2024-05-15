' use strict'

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {

    login: async (req, res) => {
        const { username, email, password } = req.body;
        if (!((username || email) && password)) {
            res.errorStatusCode = 403;
            throw new Error("Please provide the credentials");
        };

        const user = await User.findOne({
            $or: [{ username }, { email }],
            password,
        });

        if (!user) {
            res.errorStatusCode = 403;
            throw new Error("Credentials are wrong");
        };

        if (!user.isActive) {
            res.errorStatusCode = 401;
            throw new Error("You must be an active user");
        };

        let tokenData = await Token.findOne({ userId: user._id });

        if (!tokenData) {
            tokenData = await Token.create({ userId: user._id, token: passwordEncrypt(Date.now() + user._id) });
        };

        res.send({
            error: false,
            token: tokenData.token,
            user: user
        });
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