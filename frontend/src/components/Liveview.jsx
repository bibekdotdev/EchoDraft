import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlogContentRenderer from "./BlogContentRenderer";

const LiveView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { content = [], previews = {} } = location.state || {};

  return (
    content.length > 0 && (
      <Box
        sx={{
          mt: 4,
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, sm: 5, md: 6 },
          mx: "auto",
          bgcolor: "#ffffff",
          borderRadius: 4,
          boxShadow: 3,
          fontFamily: "'Georgia', serif",
          lineHeight: 1.8,
          maxWidth: "1400px",
          width: "100%",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#388087",
              color: "#388087",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#388087",
                color: "#ffffff",
              },
            }}
          >
            Back to Editor
          </Button>
        </Box>

        {/* Blog Content */}
        <Box
          sx={{
            "& img": {
              display: "block",
              margin: "24px auto",
              maxWidth: "100%",
              width: { xs: "100%", sm: "80%", md: "60%" },
              height: "auto",
              borderRadius: 2,
            },
          }}
        >
          <BlogContentRenderer content={content} previews={previews} />
        </Box>

        {/* Footer */}
        <Divider sx={{ mt: 6, mb: 3, borderColor: "#388087" }} />
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ color: "#888", fontStyle: "italic" }}
        >
          © {new Date().getFullYear()} Blogify. All rights reserved.
        </Typography>
      </Box>
    )
  );
};

export default LiveView;
