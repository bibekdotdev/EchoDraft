import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Tooltip,
  TextField,
  Rating,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import useBlogStore from "../store/useBlogStore.js";
import axios from "axios";

const formatCount = (count) => {
  if (count >= 1_000_000) return `${Math.floor(count / 1_000_000)}M`;
  if (count >= 1_000) return `${Math.floor(count / 1_000)}K`;
  return count;
};

const BlogContentRenderer = ({ content = [] }) => (
  <Box sx={{ width: "100%" }}>
    {content.map((block, index) => {
      if (!block?.type) return null;

      const commonStyle = {
        overflowWrap: "break-word",
        wordBreak: "break-word",
        width: "100%",
      };

      switch (block.type) {
        case "title":
          return (
            <Typography
              key={index}
              variant="h4"
              sx={{ fontWeight: 700, mt: 2, mb: 2, ...commonStyle }}
            >
              {block.value}
            </Typography>
          );
        case "subtitle":
          return (
            <Typography
              key={index}
              variant="h6"
              sx={{ fontWeight: 500, mt: 2, mb: 1, ...commonStyle }}
            >
              {block.value}
            </Typography>
          );
        case "text":
          return (
            <Typography
              key={index}
              variant="body1"
              sx={{ mb: 2, lineHeight: 1.75, ...commonStyle }}
            >
              {block.value}
            </Typography>
          );
        case "image":
          return (
            <Box key={index} my={4} display="flex" justifyContent="center">
              <img
                src={block.value}
                alt={`blog-img-${index}`}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 16,
                  objectFit: "contain",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                className="blog-image"
              />
            </Box>
          );
        default:
          return null;
      }
    })}
  </Box>
);

const style = document.createElement("style");
style.innerHTML = `
  @media (min-width: 1024px) {
    .blog-image {
      max-width: 600px !important;
    }
  }
`;
document.head.appendChild(style);

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getPeosonalDetails,
    hendleLikeDislike,
    hendleReview,
    fetchReview,
    comments,
  } = useBlogStore();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState(
    localStorage.getItem(`reaction-${id}`) || ""
  );
  const [submitLoading, setSubmitLoading] = useState(false); // 🔧 added

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getPeosonalDetails(id);
        const data = res.data.data;
        await fetchReview(id);
        setBlog(data);
        setLikes(data.likes?.length || 0);
        setDislikes(data.dislikes?.length || 0);
      } catch (err) {
        setError("Blog not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      if (reaction === "like") {
        setLikes((prev) => Math.max(prev - 1, 0));
        setReaction("");
        localStorage.removeItem(`reaction-${id}`);
        await hendleLikeDislike(id, "like");
      } else {
        setLikes((prev) => prev + 1);
        if (reaction === "dislike") {
          setDislikes((prev) => Math.max(prev - 1, 0));
        }
        setReaction("like");
        localStorage.setItem(`reaction-${id}`, "like");
        await hendleLikeDislike(id, "like");
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  const handleDislike = async () => {
    try {
      if (reaction === "dislike") {
        setDislikes((prev) => Math.max(prev - 1, 0));
        setReaction("");
        localStorage.removeItem(`reaction-${id}`);
        await hendleLikeDislike(id, "dislike");
      } else {
        setDislikes((prev) => prev + 1);
        if (reaction === "like") {
          setLikes((prev) => Math.max(prev - 1, 0));
        }
        setReaction("dislike");
        localStorage.setItem(`reaction-${id}`, "dislike");
        await hendleLikeDislike(id, "dislike");
      }
    } catch (err) {
      console.error("Failed to update dislike:", err);
    }
  };

  const handleCommentSubmit = async () => {
    setSubmitLoading(true); // 🔧 start
    try {
      await hendleReview(id, rating, comment);
      setComment("");
      setRating(0);
    } catch (err) {
      console.error("Review submission failed:", err);
    } finally {
      setSubmitLoading(false); // 🔧 end
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <p>{error}</p>;
  if (!blog || !blog.content) return <p>No blog data found.</p>;

  const authorEmail = blog.uploadedBy?.email || "Unknown Author";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorEmail
  )}&background=random&color=fff`;

  return (
    <Box
      sx={{
        mt: 4,
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, sm: 5, md: 6 },
        mx: "auto",
        maxWidth: "1200px",
        bgcolor: "#fff",
        borderRadius: 4,
        boxShadow: 3,
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 4,
          borderColor: "#388087",
          color: "#388087",
          fontWeight: 600,
          borderRadius: 2,
          "&:hover": { bgcolor: "#388087", color: "#fff" },
        }}
      >
        Back
      </Button>

      <Paper elevation={0} sx={{ p: { xs: 0, sm: 2 }, mb: 3 }}>
        <BlogContentRenderer content={blog.content} />
      </Paper>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ fontWeight: 600, color: "#555" }}>
          Author & Reactions
        </Typography>
      </Divider>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          mb: 5,
          maxWidth: "100%",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={avatarUrl}
            alt="author-avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {authorEmail}
            </Typography>
            <Typography variant="caption" sx={{ color: "#888" }}>
              {new Date(blog.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            "@media (max-width:393px)": {
              marginLeft: "31px",
              marginTop: "-20px",
            },
          }}
        >
          <Tooltip title="Like this blog">
            <Button
              onClick={handleLike}
              startIcon={
                <ThumbUpAltIcon
                  sx={{
                    color: reaction === "like" ? "#4caf50" : "#9e9e9e",
                  }}
                />
              }
            >
              {formatCount(likes)}
            </Button>
          </Tooltip>

          <Tooltip title="Dislike this blog">
            <Button
              onClick={handleDislike}
              startIcon={
                <ThumbDownAltIcon
                  sx={{
                    color: reaction === "dislike" ? "#f44336" : "#9e9e9e",
                  }}
                />
              }
            >
              {formatCount(dislikes)}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave a Rating & Comment
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          sx={{ mb: 2 }}
        />
        <TextField
          multiline
          fullWidth
          minRows={3}
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={submitLoading || (!comment.trim() && rating === 0)}
          startIcon={
            submitLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : null
          }
        >
          {submitLoading ? "Submitting..." : "Submit"}
        </Button>
      </Paper>

      {comments && comments.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ fontWeight: 600 }}>
              User Reviews
            </Typography>
          </Divider>

          {comments.map((review, index) => {
            const email = review.comment_by?.email || "Anonymous";
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              email
            )}&background=random&color=fff`;

            return (
              <Paper
                key={review._id || index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <img
                    src={avatar}
                    alt="user-avatar"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {email}
                    </Typography>
                    <Rating
                      value={parseInt(review.rating) || 0}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" sx={{ color: "#444" }}>
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      <Divider sx={{ mt: 6, mb: 3 }} />
      <Typography
        variant="caption"
        textAlign="center"
        display="block"
        sx={{ color: "#888", fontStyle: "italic" }}
      >
        © {new Date().getFullYear()} Blogify. All rights reserved.
      </Typography>
    </Box>
  );
};

export default BlogDetails;
