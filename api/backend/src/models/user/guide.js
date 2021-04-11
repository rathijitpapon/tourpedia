const mongoose = require('mongoose');
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schemaConfig = require("../../../config/schemaConfig.json");

const JWT_SECRET = schemaConfig.jwtSecret;

const guideSchema = new mongoose.Schema(
    {
        username: { 
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            minLength: 6,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)) {
                    throw new Error("Email is invalid");
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    throw new Error('Password cannot contain "password"');
                }
            },
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
        },
        about: {
            type: String,
            required: false,
            trim: true,
            maxlength: 300,
        },
        profileImage: {
            type: String,
            require: true,
        },
        isBanned: {
            type: Boolean,
            required: true,
        },
        guidedEvent: [{
            _id: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }],
        travelAgency: {
            _id: mongoose.Schema.Types.ObjectId,
            ref: "TravelAgency",
            required: true,
        },
        tokens: [{
            token: {
                type: String,
                required: true,
            },
        }],
    },
    {
        timestamps: true,
    }
);

guideSchema.statics.findByCredentials = async (email, password) => {
    const guide = await guide.findOne({
        email,
    });

    if (!guide) {
        throw new Error("Email isn't found.");
    }

    const isMatch = await bcrypt.compare(password, guide.password);

    if (!isMatch) {
        throw new Error("Incorrect Password.");
    }

    return guide;
};

guideSchema.pre("save", async function (next) {
    const guide = this;

    if (guide.isModified("password")) {
        guide.password = await bcrypt.hash(guide.password, 8);
    }

    next();
});

guideSchema.methods.toJSON = function () {
    const guide = this;
    const guideObject = guide.toObject();

    delete guideObject.email
    delete guideObject.password;
    delete guideObject.tokens;
    delete guideObject.guidedEvent;

    return guideObject;
};

guideSchema.methods.generateAuthToken = async function () {
    const guide = this;

    const token = jwt.sign({
        _id: guide._id.toString()
    }, JWT_SECRET);

    guide.tokens = guide.tokens.concat({
        token
    });

    await guide.save();

    return token;
};

guideSchema.plugin(uniqueValidator);
const Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;