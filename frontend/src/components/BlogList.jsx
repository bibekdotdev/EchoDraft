import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";

const BlogList = ({ blogs, isSmallOrMedium }) => {
  if (!blogs.length)
    return <Typography textAlign="center">No blogs found.</Typography>;

  return blogs.map((post) => {
    const firstTitleObj = post.content.find((item) => item.type === "title");
    const firstImageObj = post.content.find((item) => item.type === "image");
    const firstTextObj = post.content.find((item) => item.type === "text");
    const createdAt = new Date(post.createdAt).toLocaleDateString();
    const userEmail = post.uploadedBy?.email || "Unknown";
    const userAvatar = post.uploadedBy?.avatar;
    const tags = post.tags || ["General"];

    return (
      <Card
        key={post._id}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: isSmallOrMedium ? "column-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            p: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
              {firstTitleObj?.value || "Untitled"}
            </Typography>

            {firstTextObj && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {firstTextObj.value}
              </Typography>
            )}

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
              <Avatar
                src={userAvatar}
                sx={{ width: 28, height: 28, bgcolor: "#90caf9" }}
              >
                {!userAvatar && <PersonIcon fontSize="small" />}
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {userEmail}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {createdAt}
              </Typography>
            </Box>

            <Box mt={1.5} display="flex" gap={2}>
              <Tooltip title="Likes">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ThumbUpAltIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{post.likes}</Typography>
                </Box>
              </Tooltip>
              <Tooltip title="Dislikes">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ThumbDownAltIcon fontSize="small" color="error" />
                  <Typography variant="body2">{post.dislikes}</Typography>
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
                "&:hover": {
                  bgcolor: "#e3f2fd",
                  borderColor: "#1565c0",
                },
              }}
            >
              Read More
            </Button>
          </Box>

          <Box
            sx={{
              width: isSmallOrMedium ? "100%" : 160,
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            {firstImageObj?.value ? (
              <CardMedia
                component="img"
                image={firstImageObj.value}
                alt="Blog Image"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box sx={{ width: "100%", height: "100%" }} />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  });
};

export default BlogList;
