const mongoose = require("mongoose");
const Comment = require("./Comment");
const BlockSchema = mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockType: {
      type: String,
      require: true,
    },
    content: [
      {
        type: {
          type: String,
          require: true,
        },
        value: {
          type: String,
          require: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

BlockSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    console.log(doc);
    await Comment.deleteMany({
      comment_for: doc._id,
    });
    console.log(`Deleted comments for blog "${doc.title}"`);
  }
  next();
});
const Block = mongoose.model("Block", BlockSchema);
module.exports = Block;
