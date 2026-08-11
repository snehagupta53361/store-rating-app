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
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Store } from "@mui/icons-material";
import { useSignupMutation } from "../../store/api/authApi.js";
import { validateSignup } from "../../utils/validations/signupValidations.js";
import { Star } from "lucide-react";

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[!@#$%^&*]/.test(password)) score += 20;
  return Math.min(score, 100);
};

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.global.currentUser);

  // RTK Query mutation
  const [signup] = useSignupMutation();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    if (currentUser) navigate("/dashboard");
  }, [currentUser, navigate]);

  const handleChange = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validateSignup(fields);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(fields).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(
        err?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  const strength = getPasswordStrength(fields.password);
  const strengthColor =
    strength < 40 ? "#ff6b6b" : strength < 70 ? "#ffd166" : "#55efc4";
  const strengthLabel =
    strength < 40 ? "Weak" : strength < 70 ? "Moderate" : "Strong";

  const altBg = theme.palette.background.alt;

  const RequiredLabel = ({ text }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="body2" component="span">
        {text}
      </Typography>
      <Star size={5} fill="#e74c3c" color="#e74c3c" />
    </Box>
  );

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
          maxWidth: 500,
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
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(162,155,254,0.4)",
            }}
          >
            <Store sx={{ color: "#fff", fontSize: 32 }} />
          </Box>

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: theme.palette.neutral[0] || theme.palette.text.primary,
            }}
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.neutral[300], mt: 0.5 }}
          >
            Join Store Rate App
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {submitError}
            </Alert>
          )}

          <TextField
            fullWidth
            label={<RequiredLabel text="Full Name" />}
            value={fields.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={
              errors.name || `${fields.name.length}/60 chars (min 20)`
            }
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label={<RequiredLabel text="Email Address" />}
            type="email"
            value={fields.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label={<RequiredLabel text="Address" />}
            multiline
            rows={2}
            value={fields.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address || `${fields.address.length}/400 chars`}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label={<RequiredLabel text="Password" />}
            type={showPassword ? "text" : "password"}
            value={fields.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={
              errors.password ||
              "8–16 chars, one uppercase, one special character (!@#$%^&*)"
            }
            sx={{ mb: 1 }}
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

          {/* Password strength bar */}
          {fields.password && (
            <Box mb={2}>
              <LinearProgress
                variant="determinate"
                value={strength}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    backgroundColor: strengthColor,
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{ color: strengthColor, mt: 0.5, display: "block" }}
              >
                Password strength: {strengthLabel}
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "10px",
              py: 1.5,
              mt: 1,
              "&:hover": {
                background: "linear-gradient(135deg, #b8b0fe 0%, #8075e9 100%)",
                boxShadow: "0 8px 24px rgba(162,155,254,0.4)",
              },
            }}
          >
            Create Account
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.neutral[400] }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: theme.palette.secondary[300],
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
