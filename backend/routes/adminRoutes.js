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

router.get("/adminBlogs", protectedRoute, async (req, res) => {
  let user = await User.findOne({ email: req.user });
  const blocks = await Block.find({ uploadedBy: user._id })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "email");

  res.status(200).send({ blocks });
});

router.get("/adminscarchResult/:value", protectedRoute, async (req, res) => {
  let user = await User.findOne({ email: req.user });
  const { value } = req.params;
  const blocks = await Block.find({
    $and: [
      {
        $or: [
          { "content.value": { $regex: value, $options: "i" } },
          { blockType: { $regex: value, $options: "i" } },
        ],
      },
      { uploadedBy: user._id },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "email");
  res.status(200).send({ blocks });
});

router.get("/onFilterChange", protectedRoute, async (req, res) => {
  try {
    const { type, sort, time } = req.query;

    // Get logged-in user
    const user = await User.findOne({ email: req.user });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const query = { uploadedBy: user._id };

    // Filter by block type
    if (type && type !== "all") query.blockType = type;

    // Filter by time
    if (time) {
      const now = new Date();
      let dateFilter;

      if (time === "today") {
        dateFilter = new Date();
        dateFilter.setHours(0, 0, 0, 0);
      } else if (time === "last7") {
        dateFilter = new Date();
        dateFilter.setDate(now.getDate() - 7);
      } else if (time === "month") {
        dateFilter = new Date();
        dateFilter.setDate(now.getDate() - 30);
      }

      if (dateFilter) query.createdAt = { $gte: dateFilter };
    }

    // Sorting
    let aggregationPipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users", // make sure this is the correct collection name for uploadedBy
          localField: "uploadedBy",
          foreignField: "_id",
          as: "uploadedBy",
        },
      },
      { $unwind: "$uploadedBy" },
    ];

    if (sort === "topLikes") {
      aggregationPipeline.push({
        $addFields: { likesCount: { $size: "$likes" } },
      });
      aggregationPipeline.push({ $sort: { likesCount: -1 } });
    } else if (sort === "newest") {
      aggregationPipeline.push({ $sort: { createdAt: -1 } });
    } else if (sort === "oldest") {
      aggregationPipeline.push({ $sort: { createdAt: 1 } });
    } else {
      aggregationPipeline.push({ $sort: { createdAt: -1 } });
    }

    const blocks = await Block.aggregate(aggregationPipeline);

    // Remove temporary likesCount field
    const cleanedBlocks = blocks.map((block) => {
      delete block.likesCount;
      return block;
    });

    res.json({ success: true, blocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/deleteBlog/:blogToDelete", protectedRoute, async (req, res) => {
  try {
    console.log("blog is delete");
    const user = req.user; // Assuming this is the user's email
    const { blogToDelete } = req.params;

    const block = await Block.findById(blogToDelete)
      .select("uploadedBy")
      .populate("uploadedBy", "email");

    if (!block) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (block.uploadedBy.email !== user) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog." });
    }

    await Block.findByIdAndDelete(blogToDelete);
    console.log("blog is delete");
    return res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting blog." });
  }
});

router.get("/fetchBlogById/:blogId", protectedRoute, async (req, res) => {
  try {
    const { blogId } = req.params;
    const block = await Block.findById(blogId);

    if (!block) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const content = block.content || [];
    const type = block.blockType || "";

    // ✅ Build previews object from content (for image blocks)
    const previews = {};
    content.forEach((item) => {
      if (item.type === "image" && item.value) {
        previews[item.id] = item.value; // URL stored in value
      }
    });

    console.log("Fetched content blocks:", content);
    res.json({ type, content, previews });
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/updateBLogs/:blogId",
  protectedRoute,
  upload.array("images"),
  async (req, res) => {
    try {
      let { blogId } = req.params;
      console.log("hi");
      const { user } = req;
      console.log("hello", user);
      const rawContent = JSON.parse(req.body.content);
      const content = rawContent.map(({ type, value }) => ({ type, value }));

      const files = req.files;

      let fileIndex = 0;
      console.log(content);
      for (let i = 0; i < content.length; i++) {
        if (content[i].type === "image" && content[i].value == undefined) {
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

      const newBlock = await Block.findByIdAndUpdate(
        req.params.blogId,
        {
          blockType: req.body.type,
          content,
          uploadedBy,
        },
        { new: true } // optional: return the updated document
      );

      res.status(201).json({ success: true, data: newBlock });
    } catch (error) {
      console.error("Create Block Error:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }
);

module.exports = router;
