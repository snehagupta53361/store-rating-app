import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Avatar,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  useTheme,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  StorefrontOutlined,
  PersonOutline,
  Lock,
} from "@mui/icons-material";

import Header from "components/common/Header.jsx";
import { validateUpdatePassword } from "utils/validations/updatepasswordValidation";
import { useUpdatePasswordMutation } from "../../store/api/authApi.js";

const getStrength = (password) => {
  if (!password) return 0;

  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[!@#$%^&*]/.test(password)) strength += 20;

  return Math.min(strength, 100);
};

const roleMap = {
  ADMIN: {
    label: "System Administrator",
    color: "#ffd166",
    icon: <AdminPanelSettings sx={{ fontSize: 14 }} />,
  },

  STORE_OWNER: {
    label: "Store Owner",
    color: "#a29bfe",
    icon: <StorefrontOutlined sx={{ fontSize: 14 }} />,
  },

  NORMAL_USER: {
    label: "Normal User",
    color: "#55efc4",
    icon: <PersonOutline sx={{ fontSize: 14 }} />,
  },
};

const Profile = () => {
  const theme = useTheme();

  const currentUser = useSelector((state) => state.global.currentUser);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const role = roleMap[currentUser?.role] || roleMap.NORMAL_USER;

  const strength = getStrength(newPw);

  const strengthColor =
    strength < 40 ? "#ff6b6b" : strength < 70 ? "#ffd166" : "#55efc4";

  const strengthLabel =
    strength < 40 ? "Weak" : strength < 70 ? "Moderate" : "Strong";

  const bg = theme.palette.background.alt;

  const border =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)";

  const handleChangePassword = async (event) => {
    event.preventDefault();

    /*
     * Client-side validation
     */
    const validationErrors = validateUpdatePassword({
      currentPw,
      newPw,
      confirmPw,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSuccess("");

    try {
      /*
       * RTK Query mutation
       *
       * unwrap() converts rejected API responses
       * into a normal JavaScript error so that
       * we can handle it inside catch().
       */
      await updatePassword({
        currentPassword: currentPw,
        newPassword: newPw,
      }).unwrap();

      /*
       * Reset form after successful request.
       */
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");

      setSuccess("Password changed successfully!");

      /*
       * Remove success message after 4 seconds.
       */
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (error) {
      /*
       * Backend validation / authentication error.
       */
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to update password. Current password may be incorrect.";

      setErrors({
        currentPw: message,
      });
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MY PROFILE"
        subtitle="Account details and security settings"
      />

      <Grid container spacing={3} maxWidth={900} mt={1}>
        {/* ================= PROFILE CARD ================= */}

        <Grid item xs={12} md={5}>
          <Card
            sx={{
              background: bg,
              borderRadius: "20px",
              border: `1px solid ${border}`,
            }}
          >
            <CardContent
              sx={{
                p: 4,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: 32,
                  fontWeight: 700,
                  background: `linear-gradient(
                    135deg,
                    ${role.color}88,
                    ${role.color}44
                  )`,
                  border: `3px solid ${role.color}66`,
                  margin: "0 auto 16px",
                  boxShadow: `0 8px 24px ${role.color}30`,
                }}
              >
                {currentUser?.name?.[0] || "?"}
              </Avatar>

              <Typography variant="h5" fontWeight={700} mb={0.5}>
                {currentUser?.name || "Unknown User"}
              </Typography>

              <Chip
                icon={role.icon}
                label={role.label}
                size="small"
                sx={{
                  background: `${role.color}22`,
                  color: role.color,
                  mb: 3,
                }}
              />

              <Divider sx={{ mb: 2 }} />

              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                textAlign="left"
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.neutral[400],
                    }}
                  >
                    Email
                  </Typography>

                  <Typography variant="body2" fontWeight={500}>
                    {currentUser?.email || "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.neutral[400],
                    }}
                  >
                    Address
                  </Typography>

                  <Typography variant="body2" fontWeight={500}>
                    {currentUser?.address || "—"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= CHANGE PASSWORD ================= */}

        <Grid item xs={12} md={7}>
          <Card
            sx={{
              background: bg,
              borderRadius: "20px",
              border: `1px solid ${border}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}

              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "#ffd16622",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock sx={{ color: "#ffd166" }} />
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Change Password
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.neutral[400],
                    }}
                  >
                    Keep your account secure
                  </Typography>
                </Box>
              </Box>

              {/* Success Message */}

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: "10px",
                  }}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={handleChangePassword}>
                {/* Current Password */}

                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(event) => {
                    setCurrentPw(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      currentPw: undefined,
                    }));
                  }}
                  error={Boolean(errors.currentPw)}
                  helperText={errors.currentPw}
                  size="small"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrent((previous) => !previous)
                          }
                          size="small"
                          disabled={isLoading}
                          type="button"
                        >
                          {showCurrent ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* New Password */}

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(event) => {
                    setNewPw(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      newPw: undefined,
                    }));
                  }}
                  error={Boolean(errors.newPw)}
                  helperText={
                    errors.newPw ||
                    "8–16 chars, one uppercase + one special char (!@#$%^&*)"
                  }
                  size="small"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNew((previous) => !previous)}
                          size="small"
                          disabled={isLoading}
                          type="button"
                        >
                          {showNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Strength */}

                {newPw && (
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
                      sx={{
                        color: strengthColor,
                        mt: 0.5,
                        display: "block",
                      }}
                    >
                      Strength: {strengthLabel}
                    </Typography>
                  </Box>
                )}

                {/* Confirm Password */}

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPw}
                  onChange={(event) => {
                    setConfirmPw(event.target.value);

                    setErrors((previous) => ({
                      ...previous,
                      confirmPw: undefined,
                    }));
                  }}
                  error={Boolean(errors.confirmPw)}
                  helperText={errors.confirmPw}
                  size="small"
                  sx={{ mb: 3 }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirm((previous) => !previous)
                          }
                          size="small"
                          disabled={isLoading}
                          type="button"
                        >
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Submit */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    background: "linear-gradient(135deg, #ffd166, #ff9a3c)",
                    color: "#1a1a2e",
                    fontWeight: 700,
                    borderRadius: "10px",
                    py: 1.5,

                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(255,209,102,0.4)",
                    },
                  }}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
