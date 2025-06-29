import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Box, Toolbar } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: 30, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </>
  );
};

export default Layout;
