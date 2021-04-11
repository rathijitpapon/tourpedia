const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema(
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
        travelAgency: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TravelAgency"
            }
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

categorySchema.plugin(uniqueValidator);
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;