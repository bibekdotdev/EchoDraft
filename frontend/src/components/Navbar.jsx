import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import useAutStore from "../store/useAuthStore";
import { useClerk } from "@clerk/clerk-react";

export default function Navbar({ handleDrawerToggle }) {
  const { Auth, callSingout, checkLogin } = useAutStore();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    await callSingout();
    handleClose();
  };
  useEffect(() => {
    const check = async () => {
      console.log("Auth in Navbar:", Auth);
    };
    check();
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    Auth
  )}&background=random&color=fff`;

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        bgcolor: "#388087", // Updated background
        color: "#ffffff", // White text/icons
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section: Logo + Drawer Toggle */}
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap fontWeight="bold">
            EchoDraft
          </Typography>
        </Box>

        {/* Right Section: Avatar with Menu */}
        <Box display="flex" alignItems="center">
          {Auth && (
            <>
              <Avatar
                alt={Auth}
                src={avatarUrl}
                onClick={handleAvatarClick}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.4)", // soft glow
                  },
                }}
              />

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiPaper-root": {
                    bgcolor: "#e1eff1", // Light teal background
                    color: "#333", // Darker text for contrast
                  },
                }}
              >
                <MenuItem disabled sx={{ fontWeight: 500, opacity: 0.8 }}>
                  {Auth}
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#388087" }}
                  />
                  Sign out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
