'use strict'

const Reservation = require("../models/reservation");
const User = require("../models/user");
const Room = require("../models/room");

const nightCalc = (arrival_date, departure_date) => {
    const arrival = new Date(arrival_date); //! arrival_date in milliseconds
    const departure = new Date(departure_date); //! departure_date in milliseconds
    const difference = departure - arrival;

    const millisecondsPerDay = 1000 * 60 * 60 * 24; //! milliseconds in a day
    const night = Math.floor(difference / millisecondsPerDay); //! calculate the night as a day

    return night;
};

module.exports = {
    list: async (req, res) => {
        let customFilter = {};

        if (!req.user.isAdmin && !req.user.isStaff) {
            customFilter = { userId: req.user.id };
        };

        const data = await res.getModelList(Reservation, customFilter, [
            "userId",
            "roomId",
        ]);

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Reservation, customFilter),
            data
        });
    },

    create: async (req, res) => {
        let { username, guest_number, departure_date, arrival_date } = req.body;

        const currentDate = Date.now();
        const arrival = new Date(arrival_date); //! arrival_date in milliseconds
        const departure = new Date(departure_date); //! departure_date in
        const notPassed = currentDate > arrival || currentDate > departure;
        const invalidDate = arrival > departure;

        if (notPassed || invalidDate) {
            res.errorStatusCode = 400;
            throw new Error("Please enter valid dates");
        };

        const userId = (await User.findOne({ username }))._id;

        if (!userId) {
            res.errorStatusCode = 404;
            throw new Error("User name not found!");
        };

        let room;
        // finding room bedType and calculatin its price if it is not sent in  req body
        if (!req.body.bedType) {

            guest_number = guest_number ? guest_number : 1;

            if (guest_number === 1) {
                room = await Room.find({ bedType: "single" });
                console.log(room);
            } else if (guest_number === 2) {
                room = await Room.find({ bedType: "double" });
            } else if (guest_number >= 3 && guest_number < 6) {
                room = await Room.find({ bedType: "family" });
            } else if (guest_number >= 6) {
                room = await Room.find({ bedType: "king" });
            };

            if (!req.body.price) {
                req.body.price = (await Room.findOne({ _id: room[0]._id })).price;
            };

        } else {
            room = await Room.find({ bedType: req.body.bedType });
        };

        // find reserved rooms and stor if it is note them in array as a string
        const reservedRooms = await Reservation.find({
            bedType: room.bedType,
            $nor: [
                { arrival_date: { $gt: req.body.departure_date } },
                { departure_date: { $lt: req.body.arrival_date } }
            ]
        }).distinct("roomId");

        let reservedRoomsArr = [];
        for (let reservedRoom of reservedRooms) {
            reservedRoomsArr.push(reservedRoom.roomId)
        };

        // filter the rooms usung not in function and giving the bedTyoe option.
        const availableRooms = await Room.find({ '_id': { $nin: reservedRoomsArr }, "bedType": room[0].bedType });

        // if it is not found throw an error
        if (availableRooms.length === 0) {
            throw new Error("The room you are looking for is not empty at the period of time you requested.");
        };

        // Update req body 
        req.body.userId = userId;
        req.body.roomId = availableRooms[0]._id;
        req.body.night = nightCalc(arrival_date, departure_date);
        req.body.totalPrice = req.body.night * req.body.price;

        // create a reservation 
        const data = await Reservation.create(req.body);

        res.status(201).send({
            error: false,
            data
        });
    },

    read: async (req, res) => {
        let customFilter = {};
        if (!req.user.isAdmin) {
            customFilter = { userId: req.user.id };
        };

        const data = await Reservation.findOne({
            _id: req.params.id,
            ...customFilter
        }).populate(["userId", "roomId"]);

        res.status(200).send({
            error: false,
            data
        });
    },

    update: async (req, res) => {
        const data = await Reservation.updateOne({ _id: req.params.id }, req.body, {
            runValidators: true,
        });
        const newdata = await Reservation.findOne({ _id: req.params.id });
        
        res.status(202).send({
            error: false,
            data,
            newdata
        });
    },

    delete: async (req, res) => {
        const data = await Reservation.deleteOne({ _id: req.params.id });

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        });
    }
};