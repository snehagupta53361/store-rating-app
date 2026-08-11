import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  ArrowDropDownOutlined,
  AdminPanelSettingsOutlined,
  StorefrontOutlined,
  PersonOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/common/FlexBetween.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setMode, clearCredentials } from "../../store/slices/globalSlice.js";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";

const roleMap = {
  ADMIN: {
    label: "System Administrator",
    color: "#ffd166",
    icon: <AdminPanelSettingsOutlined sx={{ fontSize: 14 }} />,
  },
  STORE_OWNER: {
    label: "Store Owner",
    color: "#a29bfe",
    icon: <StorefrontOutlined sx={{ fontSize: 14 }} />,
  },
  NORMAL_USER: {
    label: "Normal User",
    color: "#55efc4",
    icon: <PersonOutlined sx={{ fontSize: 14 }} />,
  },
};

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const currentUser = useSelector((s) => s.global.currentUser);

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    dispatch(clearCredentials());
    navigate("/login");
  };

  const role = currentUser?.role || "NORMAL_USER";
  const roleInfo = roleMap[role] || roleMap.NORMAL_USER;

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: `0 1px 0 ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT: Toggle + Page label */}
        <FlexBetween gap="1rem">
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ borderRadius: "10px" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              color: theme.palette.neutral[300],
              display: { xs: "none", sm: "block" },
            }}
          >
            Store Rate Admin
          </Typography>
        </FlexBetween>

        {/* RIGHT: Theme toggle + User menu */}
        <FlexBetween gap="1rem">
          {/* Dark/Light toggle */}
          <IconButton
            onClick={() => dispatch(setMode())}
            sx={{
              borderRadius: "10px",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
              },
            }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "20px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "20px" }} />
            )}
          </IconButton>

          {/* User avatar button */}
          <Button
            onClick={handleClick}
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: "0.75rem",
              borderRadius: "12px",
              px: 1.5,
              py: 0.75,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                background: `${roleInfo.color}33`,
                border: `2px solid ${roleInfo.color}55`,
              }}
            >
              {currentUser?.name?.[0] || "?"}
            </Avatar>
            <Box textAlign="left" sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                fontWeight={700}
                fontSize="0.82rem"
                sx={{
                  color:
                    theme.palette.neutral[100] || theme.palette.text.primary,
                  lineHeight: 1.2,
                }}
              >
                {currentUser?.name?.split(" ")[0] || "User"}
              </Typography>
              <Typography
                fontSize="0.7rem"
                sx={{ color: roleInfo.color, lineHeight: 1.2 }}
              >
                {roleInfo.label}
              </Typography>
            </Box>
            <ArrowDropDownOutlined
              sx={{ color: theme.palette.neutral[400], fontSize: "20px" }}
            />
          </Button>

          {/* Dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: "12px",
                minWidth: 200,
                background: theme.palette.background.alt,
                border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              },
            }}
          >
            <Box px={2} py={1.5}>
              <Typography variant="body2" fontWeight={700}>
                {currentUser?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: roleInfo.color }}>
                {roleInfo.label}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
              sx={{ gap: 1.5, py: 1.2, mx: 0.5, borderRadius: "8px", mt: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <PersonOutlined fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <Divider sx={{ mx: 1 }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                gap: 1.5,
                py: 1.2,
                mx: 0.5,
                borderRadius: "8px",
                mb: 0.5,
                color: "#ff7675",
                "&:hover": { background: "#ff767515" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <LogoutOutlined fontSize="small" sx={{ color: "#ff7675" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
