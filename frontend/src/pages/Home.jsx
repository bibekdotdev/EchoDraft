import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Tooltip,
  Button,
  Avatar,
  Chip,
  Drawer,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import useBlogStore from "../store/useBlogStore.js";
import HomeSideber from "../components/HomeSideber";
import SearchFilterBar from "../components/SearchFilterBar";
import { useNavigate } from "react-router-dom";

let debounceTimer;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { storeAllData, fetchBlogs, getSearchResult, allData } = useBlogStore();

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
    getData(); // Initial load
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      if (value.length === 0) {
        getData(); // Fetch all data when search is cleared
        return;
      }

      try {
        setLoading(true); // Start loading
        const response = await getSearchResult(value);
        const blogBlocks = response.data.blocks;
        storeAllData(blogBlocks);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false); // End loading
      }
    }, 500);
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
      <Box px={{ xs: 1, sm: 2 }} maxWidth="1400px" mx="auto">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFilterClick={() => setDrawerOpen(true)}
        />

        <Box display="flex" flexDirection="row">
          <Box sx={{ flex: 1, pr: isSmallOrMedium ? 0 : "300px" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : allData.length === 0 ? (
              <Typography textAlign="center">No blogs found.</Typography>
            ) : (
              allData.map((post) => {
                const firstTitleObj = post.content.find(
                  (item) => item.type === "title"
                );
                const firstImageObj = post.content.find(
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
                    onClick={() => navigate(`/BlogDetails/${post._id}`)}
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
                      {/* Text Section */}
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
                            overflowWrap: "break-word",
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
                                {post.likes?.length}
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
                                {post.dislikes?.length}
                              </Typography>
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
                          ></Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>

          {/* Sidebar Desktop */}
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
              <HomeSideber setLoading={setLoading} />
            </Box>
          )}

          {/* Sidebar Drawer (Mobile) */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 260 } }}
          >
            <HomeSideber setLoading={setLoading} />
          </Drawer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
