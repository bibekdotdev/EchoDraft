import * as React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Card as MuiCard,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import useAutStore from "../../store/useAuthStore";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: "auto",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  backgroundColor: "#ffffff", // White background
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

// Centered Container
const OtpContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage:
    "radial-gradient(circle at 50% 50%, hsl(210, 100%, 98%), hsl(0, 0%, 100%))",
}));

export default function OtpSubmit() {
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const { signUPRequestWith_verifyOtp } = useAutStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setError(""); // Clear previous error
      const response = await signUPRequestWith_verifyOtp(otp);
      console.log("OTP Verified:", response.data);

      toast.success("✅ OTP verified successfully!");
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // redirect after 2 seconds
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed. Please try again.";
      toast.error(`❌ ${message}`);
    }
  };

  const handleCloseDialog = () => setSuccessDialogOpen(false);

  return (
    <>
      <CssBaseline />
      <OtpContainer>
        <Card>
          <LockIcon
            fontSize="large"
            sx={{ alignSelf: "center", color: "#388087" }}
          />
          <Typography
            component="h1"
            variant="h5"
            textAlign="center"
            fontWeight={600}
            sx={{ color: "#333" }}
          >
            OTP Verification
          </Typography>

          <Typography textAlign="center" variant="body2" sx={{ color: "#666" }}>
            Please enter the 6-digit OTP sent to your email or phone.
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextField
              id="otp"
              name="otp"
              type="text"
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              fullWidth
              required
              sx={{
                "& label": { color: "#888" },
                "& input": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#388087" },
                  "&.Mui-focused fieldset": { borderColor: "#388087" },
                },
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#388087",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#4ca3a8",
                },
              }}
            >
              Verify OTP
            </Button>
          </form>

          <Typography textAlign="center" fontSize="14px" sx={{ color: "#666" }}>
            Didn't receive the code?{" "}
            <Button
              variant="text"
              size="small"
              sx={{ color: "#388087", textTransform: "none" }}
            >
              Resend OTP
            </Button>
          </Typography>
        </Card>

        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: "#388087" }}>Success</DialogTitle>
          <DialogContent>
            <Typography>Your OTP has been verified successfully!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </OtpContainer>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </>
  );
}
