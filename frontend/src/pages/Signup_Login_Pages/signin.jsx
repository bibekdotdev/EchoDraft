import * as React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Card as MuiCard,
  FormLabel,
  FormControl,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import { SignInButton, useClerk, useUser } from "@clerk/clerk-react";
import useAutStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

// ✅ Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🌟 Primary Color Theme
const primaryColor = "#388087";

// Styled Components
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
  alignItems: "center",
  backgroundImage: "radial-gradient(circle at 50% 50%, #e4f5f7, #ffffff)",
}));

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { call_Signin_routes, clerk_auth } = useAutStore();
  const navigate = useNavigate();

  const hasSynced = React.useRef(false);

  React.useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      const sendToBackend = async () => {
        try {
          const payload = {
            clerkId: user.id,
            name: user.username || user.firstName || "unknown",
            email:
              user.primaryEmailAddress?.emailAddress || "noemail@domain.com",
          };
          await clerk_auth(payload);
          toast.success("✅ Signed in successfully with Google!");
          hasSynced.current = true;
        } catch (error) {
          toast.error("❌ Failed to sync Google sign-in.");
          console.error("❌ Failed to sync user:", error);
        }
      };
      sendToBackend();
    }
  }, [isSignedIn, user, clerk_auth]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      await call_Signin_routes(payload);
      toast.success("✅ Signed in successfully!");
      navigate("/"); // redirect on success
    } catch (err) {
      console.error(
        "Login failed:",
        err?.response?.data?.message || err.message
      );
      toast.error("❌ Invalid email or password.");
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Enter a valid email address.");
      toast.error("❌ Invalid email format.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters.");
      toast.error("❌ Password too short.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleClose = () => setOpen(false);

  const handleGoogleReSignIn = async () => {
    await signOut();
    document.getElementById("google-signin-trigger").click();
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
            Sign In
          </Typography>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
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
              Sign in
            </Button>
          </form>

         <Box sx={{ textAlign: "center", mt: 2 }}>
  <Typography
    variant="body2"
    sx={{ color: primaryColor, cursor: "pointer", fontSize: "14px" }}
    onClick={() => navigate("/signup")}
  >
    Don’t have an account? Sign up
  </Typography>
</Box>

          <Divider sx={{ my: 2 }}>or continue with</Divider>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleGoogleReSignIn}
          >
            Continue with other options
          </Button>

          {/* Hidden trigger for Clerk SignIn modal */}
          <SignInButton strategy="oauth_google" mode="modal">
            <span id="google-signin-trigger" style={{ display: "none" }} />
          </SignInButton>
        </Card>
      </SignUpContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography>
            Reset instructions will be sent to your email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </>
  );
}
