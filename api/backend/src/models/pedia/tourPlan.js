const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tourPlanSchema = new mongoose.Schema(
    {
        country: { 
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true
        },
        place: {
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Place",
            required: true
        },
        imageURL: [{
            type: String,
        }],
        videoURL: [{
            type: String,
        }],
        category: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }],
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

tourPlanSchema.plugin(uniqueValidator);
const TourPlan = mongoose.model("TourPlan", tourPlanSchema);

module.exports = TourPlan;