const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const dayPlanSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageURL: [{
            type: String,
        }],
        accomodation: {
            type: String,
        },
        accomodationQuality: {
            type: Number,
        },
        roomSize: {
            type: Number,
        },
        accomodationCost: {
            type: Number,
        },
        transport: {
            type: String,
        },
        transportCost: {
            type: Number,
        },
        otherCost: {
            type: Number,
            required: true,
        },
        timePlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TimePlan"
            }
        }]
    },
    {
        timestamps: true,
    }
);

dayPlanSchema.plugin(uniqueValidator);
const DayPlan = mongoose.model("DayPlan", dayPlanSchema);

module.exports = DayPlan;