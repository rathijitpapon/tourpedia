const mongoose = require('mongoose');
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.jwtSecret;

const userSchema = new mongoose.Schema(
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
        savedPedia: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pedia"
            }
        }],
        savedBlog: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        }],
        upvotedBlog: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        }],
        downvotedBlog: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        }],
        savedTourPlan: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TourPlan"
            }
        }],
        savedEvent: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            }
        }],
        enrolledEvent: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            }
        }],
        forumPost: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        }],
        upvotedPost: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        }],
        downvotedPost: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
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

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new Error("Email isn't found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Incorrect Password.");
    }

    return user;
};

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.email;
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.forumPost;
    delete userObject.upvotedPost;
    delete userObject.downvotedPost;

    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({
        _id: user._id.toString()
    }, JWT_SECRET);

    user.tokens = user.tokens.concat({
        token
    });

    await user.save();

    return token;
};

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;