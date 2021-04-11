const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        banner: [{
            type: String,
        }],
        imageURL: [{
            type: String,
        }],
        videoURL: [{
            type: String,
        }],
        travelAgency: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TravelAgency",
                required: true,
            }
        },
        country: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Country",
                required: true,
            }
        },
        place: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place"
            }
        }],
        guide: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Guide"
            }
        }],
        category: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            }
        }],
        dayPlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DayPlan"
            }
        }],
        enrolledUser: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
        participantLimit: {
            type: Number,
            required: true,
        },
        totalCost: {
            type: Number,
            required: true,
        },
        additionalCost: {
            type: Number,
            required: true,
        },
        isApproved: {
            type: Boolean,
            required: true,
        },
        isBanned: {
            type: Boolean,
            required: true,
        },
        planFileURL: {
            type: String,
            required: true,
        },
        agreementFileURL: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

eventSchema.plugin(uniqueValidator);
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;