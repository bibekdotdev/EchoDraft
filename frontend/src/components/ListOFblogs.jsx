// src/pages/BlogList.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Button,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useNavigate, useLocation } from "react-router-dom";

const BlogList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const allData = state?.data || [];

  if (allData.length === 0) {
    return (
      <Typography textAlign="center" mt={4}>
        No blogs found.
      </Typography>
    );
  }

  return (
    <Box>
      {allData.map((post) => {
        const firstTitleObj = post.content.find((item) => item.type === "title");
        const firstImageObj = post.content.find((item) => item.type === "image");
        const tags = post.tags || ["General"];
        const createdAt = new Date(post.createdAt).toLocaleDateString();
        const userEmail = post.uploadedBy?.email || "Unknown";
        const userAvatar =
          post.uploadedBy?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userEmail.slice(0, 2)
          )}&background=random&color=fff`;

        return (
          <Card
            key={post._id}
            onClick={() => navigate(`/BlogDetails/${post._id}`)}
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 3,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              {/* Left - Text */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {firstTitleObj?.value || "Untitled"}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      sx={{ bgcolor: "#e3f2fd", color: "#0d47a1" }}
                    />
                  ))}
                </Box>
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Avatar src={userAvatar} sx={{ width: 28, height: 28 }} />
                  <Typography variant="body2">{userEmail}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {createdAt}
                  </Typography>
                </Box>
                <Box mt={1.5} display="flex" gap={2}>
                  <Tooltip title="Likes">
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ThumbUpAltIcon fontSize="small" color="primary" />
                      <Typography variant="body2">{post.likes?.length}</Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Dislikes">
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ThumbDownAltIcon fontSize="small" color="error" />
                      <Typography variant="body2">{post.dislikes?.length}</Typography>
                    </Box>
                  </Tooltip>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    borderRadius: 2,
                    color: "#1565c0",
                    borderColor: "#1565c0",
                    px: 2,
                  }}
                >
                  Read More
                </Button>
              </Box>

              {/* Right - Image */}
              <Box sx={{ width: 180 }}>
                {firstImageObj?.value ? (
                  <CardMedia
                    component="img"
                    image={firstImageObj.value}
                    alt="Blog"
                    sx={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#eeeeee",
                      borderRadius: 2,
                    }}
                  >
                    No Image
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default BlogList;
