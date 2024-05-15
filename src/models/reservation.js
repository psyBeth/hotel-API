'use strict'

const { mongoose } = require("../configs/dbConnection");

const ReservationSchema = new mongoose.Schema({
    // _id

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },

    arrival_date: {
        type: Date,
        required: [
            true,
            "Please enter your arrival_date in YEAR-MONTH-DAY format",
        ],
    },

    departure_date: {
        type: Date,
        required: [
            true,
            "Please enter your departure_date in YEAR-MONTH-DAY format",
        ],
    },

    guest_number: {
        type: Number,
        default: 1,
    },

    night: {
        type: Number,
        set: function () {
            const arrival = new Date(this.arrival_date); //! arrival_date in milliseconds
            const departure = new Date(this.departure_date); //! departure_date in milliseconds
            const difference = departure - arrival;

            const millisecondsPerDay = 1000 * 60 * 60 * 24; //! milliseconds in a day
            const night = Math.floor(difference / millisecondsPerDay); //! calculate the night as a day

            return night;
        }
    },

    price: Number,

    totalPrice: Number,
    
}, {
    collection: "reservations",
    timestamps: true
});

module.exports = mongoose.model("Reservations", ReservationSchema);