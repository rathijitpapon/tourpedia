const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageURL: [{
            type: String,
        }],
        videoURL: {
            type: String,
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
        category: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            }
        }],
        upvote: {
            type: Number,
            required: true,
        },
        downvote: {
            type: Number,
            required: true,
        },
        isApproved: {
            type: Boolean,
            require: true,
        },
        isBanned: {
            type: Boolean,
            require: true,
        }   
    },
    {
        timestamps: true,
    }
);

blogSchema.plugin(uniqueValidator);
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;