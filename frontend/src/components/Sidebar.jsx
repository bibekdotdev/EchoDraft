import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreateIcon from "@mui/icons-material/Create";
import ArticleIcon from "@mui/icons-material/Article";

// React Router
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({
  mobileOpen,
  handleDrawerClose,
  handleDrawerToggle,
  isClosing,
  setIsClosing,
  handleDrawerTransitionEnd,
}) {
  const navigate = useNavigate();

  const dashboardItems = [
    { text: "Dashboard", icon: <DashboardIcon />, route: "/" },
  ];

  const adminItems = [
    { text: "New Blog Post", icon: <CreateIcon />, route: "/blogForm" },
    {
      text: "Manage Posts",
      icon: <ArticleIcon />,
      route: "/admin",
    },
  ];

  const renderSection = (title, items) => (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: "#b2dfdb",
          px: 2,
          pt: 2,
          pb: 0.5,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      <List>
        {items.map(({ text, icon, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(route);
                if (mobileOpen) {
                  setIsClosing(true);
                  handleDrawerClose();
                }
              }}
              sx={{
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#4fa2a9",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#e0f7fa",
                  minWidth: "40px",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const drawer = (
    <div>
      <Toolbar />
      <Divider sx={{ bgcolor: "#5e9ea3" }} />
      {renderSection("Dashboard", dashboardItems)}
      <Divider sx={{ bgcolor: "#5e9ea3", my: 1 }} />
      {renderSection("Admin Panel", adminItems)}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="blog sidebar"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={() => {
          setIsClosing(true);
          handleDrawerClose();
        }}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#388087",
            color: "#ffffff",
            borderRight: "1px solid #2c6f74",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#388087",
            color: "#ffffff",
            borderRight: "1px solid #2c6f74",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
