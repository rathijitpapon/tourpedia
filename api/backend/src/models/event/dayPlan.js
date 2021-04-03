const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const dayPlanSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        place: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Place",
        }],
        description: {
            type: String,
            required: true,
        },
        event: {
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        hotel: {
            type: String,
            required: true,
        },
        hotelCost: {
            type: Number,
            required: true,
        },
        transport: {
            type: String,
            required: true,
        },
        transportCost: {
            type: Number,
            required: true,
        },
        otherCost: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

dayPlanSchema.plugin(uniqueValidator);
const DayPlan = mongoose.model("DayPlan", dayPlanSchema);

module.exports = DayPlan;