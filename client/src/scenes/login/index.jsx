import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, Store } from "@mui/icons-material";
import { useLoginMutation } from "../../store/api/authApi.js";
import { validateLogin } from "../../utils/validations/loginValidations.js";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.global.currentUser);

  // RTK Query mutation
  const [login] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Server/API error
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (currentUser) navigate("/dashboard");
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Same validation mechanism as Signup
    const validationErrors = validateLogin({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login({ email, password }).unwrap();

      // setCredentials is already handled inside authApi's
      // onQueryStarted callback.
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again.",
      );
    }
  };

  const altBg = theme.palette.background.alt;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.primary[900]} 0%, ${theme.palette.primary[700]} 50%, ${theme.palette.primary[600]} 100%)`
            : `linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)`,
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          background: altBg,
          borderRadius: "20px",
          padding: "48px 40px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 64px rgba(0,0,0,0.6)"
              : "0 24px 64px rgba(0,0,0,0.12)",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.06)"
          }`,
        }}
      >
        {/* Logo / Title */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ffd166 0%, #ff9a3c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(255,209,102,0.4)",
            }}
          >
            <Store sx={{ color: "#1a1a2e", fontSize: 32 }} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: theme.palette.neutral[0] || theme.palette.text.primary,
            }}
          >
            Store Rate
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.neutral[300], mt: 0.5 }}
          >
            Admin & Rating Dashboard
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              // Same behavior as Signup
              setErrors((prev) => ({
                ...prev,
                email: undefined,
              }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              // Same behavior as Signup
              setErrors((prev) => ({
                ...prev,
                password: undefined,
              }));
            }}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(135deg, #ffd166 0%, #ff9a3c 100%)",
              color: "#1a1a2e",
              fontWeight: 700,
              borderRadius: "10px",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #ffdc80 0%, #ffb347 100%)",
                boxShadow: "0 8px 24px rgba(255,209,102,0.4)",
              },
            }}
          >
            Sign In
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.neutral[400] }}
          >
            New here?{" "}
            <Link
              to="/signup"
              style={{
                color: theme.palette.secondary[300],
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
