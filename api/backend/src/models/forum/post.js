const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = new mongoose.Schema(
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
        videoURL: [{
            type: String,
        }],
        comment: [{
            type: String,
        }],
        upvote: {
            type: Number,
            required: true,
        },
        downvote: {
            type: Number,
            required: true,
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

postSchema.plugin(uniqueValidator);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;