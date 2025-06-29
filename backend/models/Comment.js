const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  comment_for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  rating: {
    type: String,
    default: 0,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
