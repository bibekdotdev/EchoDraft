import React from "react";
import {
  Box,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const SearchFilterBar = ({ searchTerm, onSearchChange, onFilterClick }) => {
  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        position: "sticky",
        top: 70,
        zIndex: 10,
        pr: isSmallOrMedium ? 0 : "300px",
        mb: 4,
        bgcolor: "transparent",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          boxShadow: "0px 0px 0px 25px #5aa9b2",
          bgcolor: "#5aa9b2",
          pt: 2,
          px: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          //   borderRadius: 2,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={onSearchChange}
          fullWidth
          size="small"
          placeholder="🔍 Search Blogs"
          sx={{
            transition: "all 0.3s ease-in-out",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 0 0 2px rgba(21, 101, 192, 0.2)",
              },
            },
            "& .MuiInputBase-input": {
              transition: "all 0.2s ease",
            },
            "& .MuiInputLabel-root": {
              fontWeight: 500,
              color: "#555",
              px: 0.5,
              backgroundColor: "#fff",
              transition: "all 0.3s ease-in-out",
            },
          }}
        />
        {isSmallOrMedium && (
          <IconButton
            onClick={onFilterClick}
            sx={{
              color: "#fff",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <FilterAltIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SearchFilterBar;
