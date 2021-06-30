const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const timePlanSchema = new mongoose.Schema(
    {
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        activity: [{
            type: String,
        }],
        cost: {
            type: Number,
            required: true,
        },
        area: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Area"
            }
        }],
    },
    {
        timestamps: true,
    }
);

timePlanSchema.plugin(uniqueValidator);
const TimePlan = mongoose.model("TimePlan", timePlanSchema);

module.exports = TimePlan;