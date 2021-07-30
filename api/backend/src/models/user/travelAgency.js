const mongoose = require('mongoose');
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.jwtSecret;

const travelAgencySchema = new mongoose.Schema(
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
        event: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
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

travelAgencySchema.statics.findByCredentials = async (email, password) => {
    const travelAgency = await TravelAgency.findOne({
        email,
    });

    if (!travelAgency) {
        throw new Error("Email isn't found.");
    }

    const isMatch = await bcrypt.compare(password, travelAgency.password);

    if (!isMatch) {
        throw new Error("Incorrect Password.");
    }

    return travelAgency;
};

travelAgencySchema.pre("save", async function (next) {
    const travelAgency = this;

    if (travelAgency.isModified("password")) {
        travelAgency.password = await bcrypt.hash(travelAgency.password, 8);
    }

    next();
});

travelAgencySchema.methods.toJSON = function () {
    const travelAgency = this;
    const travelAgencyObject = travelAgency.toObject();

    delete travelAgencyObject.email;
    delete travelAgencyObject.password;
    delete travelAgencyObject.tokens;

    return travelAgencyObject;
};

travelAgencySchema.methods.generateAuthToken = async function () {
    const travelAgency = this;

    const token = jwt.sign({
        _id: travelAgency._id.toString()
    }, JWT_SECRET);

    travelAgency.tokens = travelAgency.tokens.concat({
        token
    });

    await travelAgency.save();

    return token;
};

travelAgencySchema.plugin(uniqueValidator);
const TravelAgency = mongoose.model("TravelAgency", travelAgencySchema);

module.exports = TravelAgency;