const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const areaSchema = new mongoose.Schema(
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

areaSchema.plugin(uniqueValidator);
const Area = mongoose.model("Area", areaSchema);

module.exports = Area;