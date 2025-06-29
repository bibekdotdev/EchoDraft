import * as React from "react";
import {
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import useAutStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

// 🌟 Primary Color Theme
const primaryColor = "#388087";

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
  backgroundColor: "#ffffff",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

const SignUpContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundImage: "radial-gradient(circle at 50% 50%, #e4f5f7, #ffffff)",
}));

export default function SignUp() {
  const [usernameError, setUsernameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const { forOtpWithData, pushId } = useAutStore();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      let res = await forOtpWithData(payload);
      pushId(res.data.id);
      navigate("/OtpSubmit");
    } catch (err) {
      if (err?.response?.data?.message) {
        console.error("OTP request failed:", err.response.data.message);
      } else {
        console.error("An unexpected error occurred:", err.message);
      }
    }
  };

  const validateInputs = () => {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let isValid = true;

    if (!username.value || username.value.length < 3) {
      setUsernameError(true);
      setUsernameErrorMessage("Username must be at least 3 characters.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <CssBaseline />
      <SignUpContainer>
        <Card>
          <LockIcon
            fontSize="large"
            sx={{ alignSelf: "center", color: primaryColor }}
          />
          <Typography
            component="h1"
            variant="h5"
            textAlign="center"
            fontWeight={600}
            color={primaryColor}
          >
            Create Account
          </Typography>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <FormControl>
              <FormLabel htmlFor="username" sx={{ fontWeight: 500 }}>
                Username
              </FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id="username"
                name="username"
                placeholder="Your Name"
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email" sx={{ fontWeight: 500 }}>
                Email
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="you@email.com"
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ fontWeight: 500 }}>
                Password
              </FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                name="password"
                placeholder="••••••"
                type="password"
                required
                fullWidth
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                backgroundColor: primaryColor,
                ":hover": { backgroundColor: "#2f6c74" },
              }}
            >
              Sign up
            </Button>
          </form>

          <Typography
            onClick={() => navigate("/signin")}
            sx={{
              textAlign: "center",
              fontSize: "14px",
              mt: 2,
              cursor: "pointer",
              color: primaryColor,
            }}
          >
            Already have an account? Sign in
          </Typography>
        </Card>
      </SignUpContainer>
    </>
  );
}
