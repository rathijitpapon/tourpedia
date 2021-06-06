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
        banner: {
            type: String,
            required: true,
        },
        imageURL: [{
            type: String,
        }],
        videoURL: {
            type: String,
        },
        groupOption: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        inclusion: [{
            type: String,
        }],
        minimumAge: {
            type: Number,
            required: true,
        },
        maximumAge: {
            type: Number,
            required: true,
        },
        childAllowed: {
            type: Boolean,
            required: true,
        },
        physicalRating: {
            type: String,
            required: true,
        },
        participantLimit: {
            type: Number,
            required: true,
        },
        accomodationOption: [{
            type: String,
            required: true,
        }],
        category: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            }
        }],
        totalCost: {
            type: Number,
            required: true,
        },
        possibleAdditionalCost: {
            type: Number,
            required: true,
        },
        dayPlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DayPlan"
            }
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
        enrolledUser: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
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