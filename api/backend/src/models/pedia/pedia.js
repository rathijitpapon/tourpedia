const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const pediaSchema = new mongoose.Schema(
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
        area: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "AreaDescription"
        }],
        food: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "FoodDescription"
        }],
        tourPlan: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "TourPlan"
        }],
        rating: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

pediaSchema.plugin(uniqueValidator);
const Pedia = mongoose.model("Pedia", pediaSchema);

module.exports = Pedia;