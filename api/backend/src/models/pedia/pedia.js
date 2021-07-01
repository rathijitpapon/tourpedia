const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const pediaSchema = new mongoose.Schema(
    {
        country: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Country",
                required: true,
            }
        },
        place: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place",
                required: true,
            }
        },
        imageURL: [{
            type: String,
        }],
        videoURL: {
            type: String,
        },
        area: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Area"
            }
        }],
        food: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            }
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