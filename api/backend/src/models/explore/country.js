const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const countrySchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        banner: [{
            type: String,
        }],
        place: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place"
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

countrySchema.plugin(uniqueValidator);
const Country = mongoose.model("Country", countrySchema);

module.exports = Country;