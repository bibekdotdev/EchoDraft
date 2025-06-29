// src/components/AdminSideber.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import useAdminStore from "../store/useAdminStore.js";

const blogTypeOptions = [
  "personal",
  "professional",
  "tutorial",
  "review",
  "news",
  "listicle",
  "interview",
  "case-study",
  "travel",
  "food",
  "fitness",
  "tech",
  "lifestyle",
  "education",
  "poetry",
  "business",
  "photo",
  "spiritual",
  "guest",
];

const sortOptions = [
  { label: "Top Likes", value: "topLikes" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const timeFilters = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "This Month", value: "month" },
];

const AdminSideber = ({ setLoading }) => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedTime, setSelectedTime] = useState(null);

  const { onFilterChange, storeAllData, fetchBlogs } = useAdminStore();

  useEffect(() => {
    const runFilter = async () => {
      try {
        setLoading(true);
        if (
          selectedType === "all" &&
          selectedSort === "newest" &&
          selectedTime === null
        ) {
          const response = await fetchBlogs();
          storeAllData(response.data.blocks);
        } else {
          const response = await onFilterChange(
            selectedType,
            selectedSort,
            selectedTime
          );
          storeAllData(response.data.blocks);
        }
      } catch (error) {
        console.error("Filter error:", error);
      } finally {
        setLoading(false);
      }
    };

    runFilter();
  }, [selectedType, selectedSort, selectedTime]);

  return (
    <Box
      height="100vh"
      sx={{
        width: { xs: 260, sm: 300 },
        position: "fixed",
        right: 0,
        zIndex: 900,
        background: "linear-gradient(to right, #e1eff1, #f7fdfd)",
        borderLeft: "1px solid #c8e3e5",
        overflowY: "auto",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        🔎 Filter by Type
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
        <Chip
          label="All"
          size="small"
          clickable
          onClick={() => setSelectedType("all")}
          color={selectedType === "all" ? "primary" : "default"}
        />
        {blogTypeOptions.map((type) => (
          <Chip
            key={type}
            label={type}
            size="small"
            clickable
            onClick={() => setSelectedType(type)}
            color={selectedType === type ? "primary" : "default"}
          />
        ))}
      </Box>

      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        📊 Sort By
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
        {sortOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            size="small"
            clickable
            onClick={() => setSelectedSort(option.value)}
            color={selectedSort === option.value ? "secondary" : "default"}
          />
        ))}
      </Box>

      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        🕓 Time Filter
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {timeFilters.map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            size="small"
            clickable
            onClick={() => setSelectedTime(filter.value)}
            color={selectedTime === filter.value ? "success" : "default"}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AdminSideber;
