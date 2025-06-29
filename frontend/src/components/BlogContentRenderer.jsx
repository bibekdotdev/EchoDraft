import React from "react";
import { Typography } from "@mui/material";

const BlogContentRenderer = ({ content, previews }) => {
  return (
    <>
      {content.map((block) => {
        switch (block.type) {
          case "title":
            return (
              <Typography
                key={block.id}
                variant="h3"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {block.value}
              </Typography>
            );
          case "subtitle":
            return (
              <Typography
                key={block.id}
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {block.value}
              </Typography>
            );
          case "text":
            return (
              <Typography
                key={block.id}
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem" }}
              >
                {block.value}
              </Typography>
            );
          case "image":
            const src = previews[block.id] || block.value;
            return (
              <img
                key={block.id}
                src={src}
                alt="blog"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default BlogContentRenderer;
