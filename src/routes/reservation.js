'use strict'

const router = require("express").Router();

const reservation = require("../controllers/reservation");
const permissions = require("../middlewares/permissions");

//? URL: /reservations

router.route("/")
    .get(reservation.list)
    .post(reservation.create);

router.route("/:id")
    .get(permissions.isLogin, reservation.read)
    .put(permissions.isAdmin, reservation.update)
    .patch(permissions.isAdmin, reservation.update)
    .delete(permissions.isAdmin, reservation.delete);

module.exports = router;