import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Avatar,
  Chip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  DashboardOutlined,
  StorefrontOutlined,
  PersonOutlined,
  LogoutOutlined,
  StarRateOutlined,
  BarChartOutlined,
} from "@mui/icons-material";
import { clearCredentials } from "../../store/slices/globalSlice.js";

// ─── Nav items per role ───────────────────────
const NAV_ITEMS = {
  ADMIN: [
    { text: "Dashboard", icon: <DashboardOutlined />, path: "/dashboard" },
    { text: "Store Directory", icon: <StorefrontOutlined />, path: "/stores" },
    { text: "Analytics", icon: <BarChartOutlined />, path: "/analytics" },
    { text: "Profile", icon: <PersonOutlined />, path: "/profile" },
  ],
  STORE_OWNER: [
    { text: "My Store", icon: <StarRateOutlined />, path: "/dashboard" },
    { text: "Analytics", icon: <BarChartOutlined />, path: "/analytics" },
    { text: "Profile", icon: <PersonOutlined />, path: "/profile" },
  ],
  NORMAL_USER: [
    {
      text: "Store Directory",
      icon: <StorefrontOutlined />,
      path: "/dashboard",
    },
    { text: "Analytics", icon: <BarChartOutlined />, path: "/analytics" },
    { text: "Profile", icon: <PersonOutlined />, path: "/profile" },
  ],
};

const roleMap = {
  ADMIN: { label: "System Administrator", color: "#ffd166" },
  STORE_OWNER: { label: "Store Owner", color: "#a29bfe" },
  NORMAL_USER: { label: "Normal User", color: "#55efc4" },
};

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentUser = useSelector((s) => s.global.currentUser);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const role = currentUser?.role || "NORMAL_USER";
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.NORMAL_USER;
  const roleInfo = roleMap[role] || roleMap.NORMAL_USER;

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              borderRight: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)"
              }`,
            },
          }}
        >
          <Box width="100%" height="100%" display="flex" flexDirection="column">
            {/* Logo */}
            <Box m="1.5rem 2rem 1rem">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #ffd166, #ff9a3c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(255,209,102,0.3)",
                    }}
                  >
                    <StorefrontOutlined
                      sx={{ color: "#1a1a2e", fontSize: 20 }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: theme.palette.secondary[300] }}
                  >
                    Store Rate
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* User Info */}
            <Box mx="1.5rem" mb={2}>
              <Box
                sx={{
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)",
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    fontWeight: 700,
                    background: `${roleInfo.color}33`,
                    border: `2px solid ${roleInfo.color}55`,
                  }}
                >
                  {currentUser?.name?.[0] || "?"}
                </Avatar>
                <Box overflow="hidden">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{
                      color:
                        theme.palette.neutral[100] ||
                        theme.palette.text.primary,
                    }}
                  >
                    {currentUser?.name?.split(" ")[0] || "User"}
                  </Typography>
                  <Chip
                    label={roleInfo.label}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "10px",
                      background: `${roleInfo.color}22`,
                      color: roleInfo.color,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mx: "1rem", mb: 1 }} />

            {/* Navigation Links */}
            <List sx={{ flex: 1 }}>
              {navItems.map(({ text, icon, path }) => {
                const isActive = active === path;
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(path);
                        setActive(path);
                      }}
                      sx={{
                        mx: "0.75rem",
                        my: "2px",
                        borderRadius: "10px",
                        backgroundColor: isActive
                          ? `${roleInfo.color}22`
                          : "transparent",
                        color: isActive
                          ? roleInfo.color
                          : theme.palette.neutral[300],
                        "&:hover": {
                          backgroundColor: `${roleInfo.color}15`,
                          color: roleInfo.color,
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "36px",
                          color: isActive
                            ? roleInfo.color
                            : theme.palette.neutral[400],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 700 : 500,
                          fontSize: 14,
                        }}
                      />
                      {isActive && (
                        <ChevronRightOutlined
                          sx={{ color: roleInfo.color, fontSize: 18 }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            {/* Logout */}
            <Box p="1rem">
              <Divider sx={{ mb: 1 }} />
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: "10px",
                  color: "#ff7675",
                  "&:hover": { backgroundColor: "#ff767520" },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon sx={{ minWidth: "36px", color: "#ff7675" }}>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                />
              </ListItemButton>
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
