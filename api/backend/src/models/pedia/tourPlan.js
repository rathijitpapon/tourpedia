const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tourPlanSchema = new mongoose.Schema(
    {
        country: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Country",
                required: true
            }
        },
        place: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place",
                required: true
            }
        }],
        imageURL: [{
            type: String,
        }],
        videoURL: {
            type: String,
        },
        category: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            }
        }],
        banner: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        totalCost: {
            type: Number,
            required: true,
        },
        groupOption: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        minimuParticipantLimit: {
            type: Number,
            required: true,
        },
        accomodationOption: [{
            type: String,
            required: true,
        }],
        dayPlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DayPlan"
            }
        }]
    },
    {
        timestamps: true,
    }
);

tourPlanSchema.plugin(uniqueValidator);
const TourPlan = mongoose.model("TourPlan", tourPlanSchema);

module.exports = TourPlan;