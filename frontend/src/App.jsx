import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import LiveView from "./components/Liveview";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogForm from "./pages/BlogForm";
import SignUp from "./pages/Signup_Login_Pages/signup";
import SignIn from "./pages/Signup_Login_Pages/signin";
import OtpSubmit from "./pages/Signup_Login_Pages/otp";
import useAutStore from "./store/useAuthStore";
import CircularProgress from "@mui/material/CircularProgress";
import BlogDetails from "./pages/BlogDetails";
import Admin from "./pages/AdminPanel";
import Editing from "./pages/Eding";

// ✅ Import ToastContainer
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { Auth, checkLogin } = useAutStore();
  const [authLoading, setAuthLoading] = useState(true);

  // Drawer handlers
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDrawerClose = () => setMobileOpen(false);
  const handleDrawerTransitionEnd = () => setIsClosing(false);

  // Check login on mount
  useEffect(() => {
    const check = async () => {
      await checkLogin();
      setAuthLoading(false);
    };
    check();
  }, []);

  // Show loader while checking auth
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      {/* ✅ ToastContainer globally available */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Navbar handleDrawerToggle={handleDrawerToggle} />
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerToggle={handleDrawerToggle}
          isClosing={isClosing}
          setIsClosing={setIsClosing}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 1, mt: "30px" }}>
          <Routes>
            <Route path="/" element={Auth ? <Home /> : <SignIn />} />
            <Route
              path="/liveview"
              element={Auth ? <LiveView /> : <SignIn />}
            />
            <Route
              path="/BlogForm"
              element={Auth ? <BlogForm /> : <SignIn />}
            />
            <Route path="/Signin" element={Auth ? <Home /> : <SignIn />} />
            <Route path="/Signup" element={Auth ? <Home /> : <SignUp />} />
            <Route
              path="/OtpSubmit"
              element={Auth ? <Home /> : <OtpSubmit />}
            />
            <Route
              path="/BlogDetails/:id"
              element={Auth ? <BlogDetails /> : <SignIn />}
            />
            <Route path="/Admin" element={Auth ? <Admin /> : <SignIn />} />
            <Route
              path="/EditBlog/:id"
              element={Auth ? <Editing /> : <SignIn />}
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
