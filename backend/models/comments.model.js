import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});
const comments = mongoose.model("comment", commentSchema);

export default comments;