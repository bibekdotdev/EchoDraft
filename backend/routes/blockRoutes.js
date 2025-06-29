const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Block = require("../models/Block");
const router = express.Router();
const User = require("../models/User");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const protectedRoute = require("../middleware/protectedRoute");
const Comment = require("../models/Comment");
router.post(
  "/create",
  protectedRoute,
  upload.array("images"),
  async (req, res) => {
    try {
      console.log("hi");
      const { user } = req;
      console.log("hello", user);
      const rawContent = JSON.parse(req.body.content);
      const content = rawContent.map(({ type, value }) => ({ type, value }));

      const files = req.files;

      let fileIndex = 0;

      for (let i = 0; i < content.length; i++) {
        if (content[i].type === "image") {
          const file = files[fileIndex];

          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "blocks" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });

          content[i].value = uploadResult.secure_url;
          fileIndex++;
        }
      }
      console.log("Content after processing:", req.body.type, content);
      const uploadedBy = await User.findOne({ email: user }).select("_id");
      console.log(uploadedBy);
      const newBlock = new Block({
        blockType: req.body.type,
        content,
        uploadedBy,
      });
      await newBlock.save();

      res.status(201).json({ success: true, data: newBlock });
    } catch (error) {
      console.error("Create Block Error:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }
);

router.get("/fetchBlogs", async (req, res) => {
  const blocks = await Block.find()
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "email");

  res.status(200).send({ blocks });
});
router.get("/getscarchResult/:value", async (req, res) => {
  const { value } = req.params;
  const blocks = await Block.find({
    $or: [
      { "content.value": { $regex: value, $options: "i" } },
      { blockType: { $regex: value, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "email");
  res.status(200).send({ blocks });
});

router.get("/onFilterChange", async (req, res) => {
  try {
    const { type, sort, time } = req.query;

    const query = {};

    // Filter by blog type (unless it's "all")
    if (type && type !== "all") {
      query.blockType = type;
    }
    console.log(query.type);
    // Filter by time
    if (time) {
      const now = new Date();
      let dateFilter;

      if (time === "today") {
        dateFilter = new Date(now.setHours(0, 0, 0, 0));
      } else if (time === "last7") {
        dateFilter = new Date(now.setDate(now.getDate() - 7));
      } else if (time === "month") {
        dateFilter = new Date(now.setDate(now.getDate() - 30));
      }

      if (dateFilter) {
        query.createdAt = { $gte: dateFilter };
      }
    }

    // Apply sorting
    let sortOption = {};
    if (sort === "topLikes") {
      sortOption.likes = -1;
    } else if (sort === "newest") {
      sortOption.createdAt = -1;
    } else if (sort === "oldest") {
      sortOption.createdAt = 1;
    }

    console.log(query);
    const blocks = await Block.find(query)
      .sort(sortOption)
      .populate("uploadedBy", "email");

    console.log(blocks);
    res.json({ success: true, blocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/getPeosonalDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findOne({ _id: id }).populate(
      "uploadedBy",
      "email"
    );

    if (!block) {
      return res
        .status(404)
        .send({ message: "Blog not found", success: false });
    }

    console.log(block);
    res.status(200).send({
      message: "Blog fetched successfully",
      success: true,
      data: block,
    });
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).send({
      message: "Server error while fetching blog",
      success: false,
      error: error.message,
    });
  }
});

router.put("/hendleLikeDislike", protectedRoute, async (req, res) => {
  const { id, likeordislike } = req.body;
  const user = req.user;

  try {
    const userData = await User.findOne({ email: user }).select("_id");
    const userId = userData._id;

    const blog = await Block.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const alreadyLiked = blog.likes.includes(userId);
    const alreadyDisliked = blog.dislikes.includes(userId);

    blog.likes = blog.likes.filter(
      (uid) => uid.toString() !== userId.toString()
    );
    blog.dislikes = blog.dislikes.filter(
      (uid) => uid.toString() !== userId.toString()
    );

    if (likeordislike === "like" && !alreadyLiked) {
      blog.likes.push(userId);
    } else if (likeordislike === "dislike" && !alreadyDisliked) {
      blog.dislikes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      message: "Reaction updated",
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
    });
  } catch (err) {
    console.error("Error handling like/dislike:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/handleReview", protectedRoute, async (req, res) => {
  try {
    const { id, rating, comment } = req.body;
    const userEmail = req.user;

    // Find the user ID based on email
    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save the new comment
    const newComment = new Comment({
      comment_by: user._id,
      comment_for: id,
      comment,
      rating,
    });

    await newComment.save();

    console.log("Review submitted:", {
      productId: id,
      rating,
      comment,
      userId: user._id.toString(),
    });

    return res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error in /handleReview:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/fetchReview", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const comments = await Comment.find({ comment_for: id }).populate(
      "comment_by",
      "email"
    );

    return res.status(200).json({
      success: true,
      reviews: comments,
    });
  } catch (error) {
    console.error("Error in /fetchReview:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
