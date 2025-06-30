// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Tooltip,
  Button,
  Avatar,
  Chip,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useBlogStore from "../store/useBlogStore.js";
import SearchFilterBar from "../components/SearchFilterBar";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../store/useAdminStore.js";
import AdminSideber from "../components/AdminSideber.jsx";

let debounceTimer;

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();
  const { fetchBlogs, getscarchResult, allData, storeAllData, deletBlog } =
    useAdminStore();
  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getData = async (query = "") => {
    try {
      setLoading(true);
      const response = await fetchBlogs(query);
      const blogBlocks = response.data.blocks;
      storeAllData(blogBlocks);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length === 0) {
      getData();
    } else {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        try {
          setLoading(true);
          const response = await getscarchResult(value);
          const blogBlocks = response.data.blocks;
          storeAllData(blogBlocks);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      }, 500);
    }
  };

  const handleEdit = (blogId) => {
    navigate("/BlogForm", { state: { blogId } });
  };

  const handleDelete = (id) => {
    setBlogToDelete(id);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deletBlog(blogToDelete);
      getData();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setOpenConfirmDialog(false);
      setBlogToDelete(null);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
      <Box px={{ xs: 1, sm: 2 }} maxWidth="1400px" mx="auto">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFilterClick={() => setDrawerOpen(true)}
        />

        {loading && <LinearProgress color="primary" sx={{ my: 1 }} />}

        <Box display="flex" flexDirection="row">
          <Box sx={{ flex: 1, pr: isSmallOrMedium ? 0 : "300px" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : !Array.isArray(allData) || allData.length === 0 ? (
              <Typography textAlign="center">No blogs found.</Typography>
            ) : (
              allData.map((post) => {
                const firstTitleObj = post.content?.find(
                  (item) => item.type === "title"
                );
                const firstImageObj = post.content?.find(
                  (item) => item.type === "image"
                );
                const tags = [post.blockType] || ["General"];
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
                    sx={{
                      mb: 4,
                      mt: 1,
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
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: isSmallOrMedium
                          ? "column-reverse"
                          : "row",
                        gap: 2,
                        p: isMobile ? 1.5 : 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          gutterBottom
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                            fontSize: isMobile ? "1rem" : "1.1rem",
                            lineHeight: "1.2rem",
                            maxHeight: "2.4rem",
                          }}
                        >
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

                        <Box
                          mt={1}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          flexWrap="wrap"
                        >
                          <Avatar
                            src={userAvatar}
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: "#90caf9",
                              fontSize: "0.75rem",
                            }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {userEmail}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              "@media (max-width:340px)": {
                                marginLeft: "36px",
                              },
                            }}
                          >
                            • {createdAt}
                          </Typography>
                        </Box>

                        <Box mt={1.5} display="flex" gap={2}>
                          <Tooltip title="Likes">
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <ThumbUpAltIcon
                                fontSize="small"
                                color="primary"
                              />
                              <Typography variant="body2">
                                {Array.isArray(post.likes)
                                  ? post.likes.length
                                  : 0}
                              </Typography>
                            </Box>
                          </Tooltip>
                          <Tooltip title="Dislikes">
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <ThumbDownAltIcon
                                fontSize="small"
                                color="error"
                              />
                              <Typography variant="body2">
                                {Array.isArray(post.dislikes)
                                  ? post.dislikes.length
                                  : 0}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>

                        <Box mt={2} display="flex" gap={1.5} flexWrap="wrap">
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
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
                            onClick={() => navigate(`/BlogDetails/${post._id}`)}
                          >
                            Read More
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            startIcon={<EditIcon />}
                            sx={{ borderRadius: 2 }}
                            onClick={() => handleEdit(post._id)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{ borderRadius: 2 }}
                            onClick={() => handleDelete(post._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>

                      {/* Image Section */}
                      <Box
                        sx={{
                          width: isSmallOrMedium ? "100%" : 180,
                          display: "flex",
                          justifyContent: "center",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        {firstImageObj?.value ? (
                          <CardMedia
                            component="img"
                            image={firstImageObj.value}
                            alt="Blog Image"
                            sx={{
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "cover",
                              borderRadius: 2,
                            }}
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
                              fontSize: "0.875rem",
                              color: "#888",
                            }}
                          >
                            No image
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>

          {!isSmallOrMedium && (
            <Box
              sx={{
                width: "300px",
                position: "fixed",
                top: 65,
                right: 0,
                height: "100vh",
              }}
            >
              <AdminSideber setLoading={setLoading} />
            </Box>
          )}

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 260 } }}
          >
            <AdminSideber setLoading={setLoading} />
          </Drawer>
        </Box>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
