const mongoose = require('mongoose');
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.jwtSecret;

const adminSchema = new mongoose.Schema(
    {
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

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({
        email,
    });

    if (!admin) {
        throw new Error("Email isn't found.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error("Incorrect Password.");
    }

    return admin;
};

adminSchema.pre("save", async function (next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }

    next();
});

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();

    delete adminObject.password;
    delete adminObject.tokens;

    return adminObject;
};

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;

    const token = jwt.sign({
        _id: admin._id.toString()
    }, JWT_SECRET);

    admin.tokens = admin.tokens.concat({
        token
    });

    await admin.save();

    return token;
};

adminSchema.plugin(uniqueValidator);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;