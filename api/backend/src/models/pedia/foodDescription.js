const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const foodSchema = new mongoose.Schema(
    {
        pedia: { 
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Pedia",
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        imageURL: [{
            type: String,
        }],
        videoURL: [{
            type: String,
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

foodSchema.plugin(uniqueValidator);
const Food = mongoose.model("Food", foodSchema);

module.exports = Food;