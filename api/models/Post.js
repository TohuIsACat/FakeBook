const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        maxlength: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);