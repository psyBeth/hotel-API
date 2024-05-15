'use strict'

// AUTHORIZATION

module.exports = {

    isLogin: (req, res, next) => {

        next();

    },

    isAdmin: (req, res, next) => {

        next();

        if (req.user && req.user.isActive && req.user.isAdmin) {
            next();
        } else {
            res.errorStatusCode = 403;
            throw new Error(' You must login and must be admin.');
        };
    }
};