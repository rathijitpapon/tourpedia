const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const placeSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
            required: true,
        },
        country: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Country",
                required: true,
            }
        },
        pedia: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pedia",
            }
        },
        category: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            }
        }],
        blog: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        }],
        tourPlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TourPlan"
            }
        }],
        event: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            }
        }],
    },
    {
        timestamps: true,
    }
);

placeSchema.plugin(uniqueValidator);
const Place = mongoose.model("Place", placeSchema);

module.exports = Place;