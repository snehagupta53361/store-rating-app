import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Chip,
  Avatar,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

import {
  People,
  Store,
  StarRate,
  PersonAdd,
  AddBusiness,
  AdminPanelSettings,
  PersonOutline,
  StorefrontOutlined,
} from "@mui/icons-material";

import Header from "components/common/Header.jsx";

import {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} from "../../store/api/userApi.js";

import {
  useCreateStoreMutation,
  useGetAllStoresQuery,
} from "../../store/api/storeApi.js";

import { useGetDashboardQuery } from "../../store/api/dashboardApi.js";
import { validateCreateStore } from "utils/validations/createStoreValidations";
import { validateCreateUser } from "utils/validations/createUserValidations";

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

const StatCard = ({ icon, label, value, color, subtitle }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: theme.palette.background.alt,
        borderRadius: "16px",
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)"
        }`,
        transition: "transform 0.2s, box-shadow 0.2s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 32px ${color}30`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.neutral[400],
                mb: 1,
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                color: theme.palette.neutral[0] || theme.palette.text.primary,
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.neutral[400],
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              background: `${color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(icon, {
              sx: {
                color,
                fontSize: 28,
              },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Role Badge
// ─────────────────────────────────────────────

const roleBadge = (role) => {
  const map = {
    ADMIN: {
      label: "Admin",
      color: "#ffd166",
      icon: <AdminPanelSettings sx={{ fontSize: 12 }} />,
    },

    STORE_OWNER: {
      label: "Store Owner",
      color: "#a29bfe",
      icon: <StorefrontOutlined sx={{ fontSize: 12 }} />,
    },

    NORMAL_USER: {
      label: "User",
      color: "#55efc4",
      icon: <PersonOutline sx={{ fontSize: 12 }} />,
    },
  };

  const roleData = map[role] || map.NORMAL_USER;

  return (
    <Chip
      icon={roleData.icon}
      label={roleData.label}
      size="small"
      sx={{
        background: `${roleData.color}22`,
        color: roleData.color,
        borderColor: `${roleData.color}44`,
        border: "1px solid",
      }}
    />
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const AdminDashboard = () => {
  const theme = useTheme();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [userApiError, setUserApiError] = useState("");
  const [storeApiError, setStoreApiError] = useState("");
  const [userDialog, setUserDialog] = useState(false);
  const [storeDialog, setStoreDialog] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "ALL",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "NORMAL_USER",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userErrors, setUserErrors] = useState({});
  const [storeErrors, setStoreErrors] = useState({});

  // RTK queries
  // ───────────────────────────────────────────
  // Dashboard
  // ───────────────────────────────────────────

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErrorData,
  } = useGetDashboardQuery();

  // ───────────────────────────────────────────
  // ALL USERS

  const {
    data: allUsers = [],
    isLoading: allUsersLoading,
    isError: allUsersError,
    error: allUsersErrorData,
  } = useGetAllUsersQuery({});

  // ───────────────────────────────────────────
  // FILTERED USERS

  const queryParams = {
    ...(filters.name.trim() && { name: filters.name.trim() }),
    ...(filters.email.trim() && { email: filters.email.trim() }),
    ...(filters.address.trim() && { address: filters.address.trim() }),
    ...(filters.role !== "ALL" && { role: filters.role }),
  };

  const {
    data: filteredUsers = [],
    isLoading: filteredUsersLoading,
    isError: filteredUsersError,
    error: filteredUsersErrorData,
  } = useGetAllUsersQuery(queryParams);

  // ───────────────────────────────────────────
  // Stores
  // ───────────────────────────────────────────

  const {
    data: stores = [],
    isLoading: storesLoading,
    isError: storesError,
    error: storesErrorData,
  } = useGetAllStoresQuery();

  const {
    data: selectedUser,
    isLoading: selectedUserLoading,
    isError: selectedUserError,
    error: selectedUserErrorData,
  } = useGetUserByIdQuery(selectedUserId, {
    skip: !selectedUserId,
  });

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();

  const [createStore, { isLoading: creatingStore }] = useCreateStoreMutation();

  // ───────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────

  const loading =
    dashboardLoading ||
    allUsersLoading ||
    filteredUsersLoading ||
    storesLoading;

  // ───────────────────────────────────────────
  // Error handling
  // ───────────────────────────────────────────

  const apiError =
    dashboardErrorData ||
    allUsersErrorData ||
    filteredUsersErrorData ||
    storesErrorData;

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // ───────────────────────────────────────────
  // Dashboard stats
  // ───────────────────────────────────────────

  const stats = dashboardData || {
    totalUsers: allUsers.length,
    totalStores: stores.length,
    totalRatings: 0,
  };

  // ───────────────────────────────────────────
  // User statistics
  //
  // IMPORTANT:
  // Use allUsers here, NOT filteredUsers.
  // ───────────────────────────────────────────

  const admins = allUsers.filter((user) => user.role === "ADMIN").length;

  const storeOwners = allUsers.filter((user) => user.role === "STORE_OWNER");

  const storeOwnersCount = storeOwners.length;

  const normalUsers = allUsers.filter(
    (user) => user.role === "NORMAL_USER",
  ).length;

  // ───────────────────────────────────────────
  // Available store owners
  // ───────────────────────────────────────────

  const assignedOwnerIds = new Set(
    stores.map((store) => store.ownerId).filter(Boolean),
  );

  const availableStoreOwners = storeOwners.filter(
    (user) => !assignedOwnerIds.has(user.id),
  );

  // ───────────────────────────────────────────
  // Success message
  // ───────────────────────────────────────────

  const showSuccess = (message) => {
    setSuccessMsg(message);

    setTimeout(() => {
      setSuccessMsg("");
    }, 3500);
  };

  // ───────────────────────────────────────────
  // Add User
  // ───────────────────────────────────────────

  const handleAddUser = async () => {
    const errors = validateCreateUser(userForm);

    if (Object.keys(errors).length > 0) {
      setUserErrors(errors);
      return;
    }

    setUserErrors({});
    setUserApiError("");

    try {
      await createUser(userForm).unwrap();

      setUserDialog(false);

      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "NORMAL_USER",
      });

      setUserErrors({});
      setUserApiError("");

      showSuccess("User added successfully!");
    } catch (error) {
      setUserApiError(
        error?.data?.message || error?.message || "Failed to create user.",
      );
    }
  };

  // ───────────────────────────────────────────
  // Add Store
  // ───────────────────────────────────────────

  const handleAddStore = async () => {
    const errors = validateCreateStore(storeForm);

    if (Object.keys(errors).length > 0) {
      setStoreErrors(errors);
      return;
    }

    setStoreErrors({});
    setStoreApiError("");

    try {
      await createStore(storeForm).unwrap();

      setStoreDialog(false);

      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      setStoreErrors({});
      setStoreApiError("");

      showSuccess("Store added successfully!");
    } catch (error) {
      setStoreApiError(
        error?.data?.message || error?.message || "Failed to create store.",
      );
    }
  };

  // Get User by id:-
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };
  // ───────────────────────────────────────────
  // Global API error
  // ───────────────────────────────────────────

  const hasApiError =
    dashboardError || allUsersError || filteredUsersError || storesError;

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="ADMIN DASHBOARD"
        subtitle="Overview of the entire platform"
      />

      {/* Error */}
      {(hasApiError || errorMsg) && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "10px",
          }}
        >
          {errorMsg ||
            apiError?.data?.message ||
            "Failed to load dashboard data."}
        </Alert>
      )}

      {/* Success */}
      {successMsg && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: "10px",
          }}
        >
          {successMsg}
        </Alert>
      )}

      {/* ───────────────── Stats ───────────────── */}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            label="Total Users"
            value={stats.totalUsers}
            subtitle={`${admins} admins · ${storeOwnersCount} owners · ${normalUsers} users`}
            color="#ffd166"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Store />}
            label="Total Stores"
            value={stats.totalStores}
            color="#a29bfe"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<StarRate />}
            label="Total Ratings"
            value={stats.totalRatings}
            color="#55efc4"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AdminPanelSettings />}
            label="Administrators"
            value={admins}
            color="#ff7675"
          />
        </Grid>
      </Grid>

      {/* ───────────────── Actions ───────────────── */}

      <Box display="flex" gap={2} mb={4}>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => {
            setUserDialog(true);
            setUserErrors({});
            setUserApiError("");
            setErrorMsg("");
          }}
          sx={{
            background: "linear-gradient(135deg, #ffd166, #ff9a3c)",
            color: "#1a1a2e",
            fontWeight: 700,
            borderRadius: "10px",

            "&:hover": {
              boxShadow: "0 6px 20px rgba(255,209,102,0.4)",
            },
          }}
        >
          Add User
        </Button>

        <Button
          variant="contained"
          startIcon={<AddBusiness />}
          onClick={() => {
            setStoreDialog(true);
            setStoreErrors({});
            setStoreApiError("");
            setErrorMsg("");
          }}
          sx={{
            background: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "10px",

            "&:hover": {
              boxShadow: "0 6px 20px rgba(162,155,254,0.4)",
            },
          }}
        >
          Add Store
        </Button>
      </Box>

      {/* ───────────────── Users ───────────────── */}

      <Box mb={2}>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            color: theme.palette.neutral[100] || theme.palette.text.primary,
            mb: 2,
          }}
        >
          All Users
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          {/* Name */}
          <TextField
            size="small"
            label="Name"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            sx={{ width: 200 }}
          />

          {/* Email */}
          <TextField
            size="small"
            label="Email"
            placeholder="Search by email"
            value={filters.email}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            sx={{ width: 220 }}
          />

          {/* Address */}
          <TextField
            size="small"
            label="Address"
            placeholder="Search by address"
            value={filters.address}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            sx={{ width: 220 }}
          />

          {/* Role */}
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>

            <Select
              labelId="role-filter-label"
              value={filters.role}
              label="Role"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            >
              <MenuItem value="ALL">All Roles</MenuItem>
              <MenuItem value="NORMAL_USER">Normal Users</MenuItem>
              <MenuItem value="STORE_OWNER">Store Owners</MenuItem>
              <MenuItem value="ADMIN">System Admins</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() =>
              setFilters({
                name: "",
                email: "",
                address: "",
                role: "ALL",
              })
            }
            disabled={
              !filters.name &&
              !filters.email &&
              !filters.address &&
              filters.role === "ALL"
            }
          >
            Clear
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          background: theme.palette.background.alt,
          borderRadius: "16px",
          mb: 4,
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)"
          }`,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Name", "Email", "Address", "Role", "Rating"].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.neutral[300],
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 3,
                    color: theme.palette.neutral[400],
                  }}
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  selected={selectedUserId === user.id}
                  onClick={() => handleUserSelect(user.id)}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 12,
                          background: "#ffd16644",
                        }}
                      >
                        {user.name?.[0] || "?"}
                      </Avatar>

                      <Typography variant="body2">{user.name}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {user.email}
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                      maxWidth: 200,
                    }}
                  >
                    <Typography variant="body2" noWrap>
                      {user.address}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {roleBadge(user.role)}
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {user.role === "STORE_OWNER" &&
                    user.rating !== null &&
                    user.rating !== undefined ? (
                      <Chip
                        icon={
                          <StarRate
                            sx={{
                              fontSize: 14,
                            }}
                          />
                        }
                        label={user.rating}
                        size="small"
                        sx={{
                          background: "#ffd16622",
                          color: "#ffd166",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ───────────────── Selected User ───────────────── */}

      {selectedUserId && (
        <Box mb={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                color: theme.palette.neutral[100] || theme.palette.text.primary,
              }}
            >
              User Details
            </Typography>

            <Button variant="text" onClick={() => setSelectedUserId(null)}>
              Clear Selection
            </Button>
          </Box>

          {selectedUserLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <CircularProgress color="secondary" />
            </Box>
          ) : selectedUserError ? (
            <Alert severity="error">
              {selectedUserErrorData?.data?.message ||
                "Failed to load user details."}
            </Alert>
          ) : selectedUser ? (
            <Card
              sx={{
                background: theme.palette.background.alt,
                borderRadius: "16px",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)"
                }`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      fontSize: 24,
                      background: "#ffd16644",
                    }}
                  >
                    {selectedUser.name?.[0]?.toUpperCase() || "?"}
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {selectedUser.name}
                    </Typography>

                    <Box mt={0.5}>{roleBadge(selectedUser.role)}</Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Email
                    </Typography>

                    <Typography variant="body1" fontWeight={500}>
                      {selectedUser.email}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Role
                    </Typography>

                    <Box mt={0.5}>{roleBadge(selectedUser.role)}</Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Address
                    </Typography>

                    <Typography variant="body1" fontWeight={500}>
                      {selectedUser.address || "—"}
                    </Typography>
                  </Grid>

                  {selectedUser.role === "STORE_OWNER" && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        Rating
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.5}
                      >
                        <StarRate
                          sx={{
                            color: "#ffd166",
                            fontSize: 20,
                          }}
                        />

                        <Typography variant="h6" fontWeight={600}>
                          {selectedUser.rating !== null &&
                          selectedUser.rating !== undefined
                            ? selectedUser.rating
                            : "—"}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ) : null}
        </Box>
      )}
      {/* ───────────────── Stores ───────────────── */}

      <Typography
        variant="h5"
        fontWeight={600}
        mb={2}
        sx={{
          color: theme.palette.neutral[100] || theme.palette.text.primary,
        }}
      >
        All Stores
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          background: theme.palette.background.alt,
          borderRadius: "16px",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)"
          }`,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Store Name", "Email", "Address", "Owner", "Avg Rating"].map(
                (heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.neutral[300],
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {heading}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {stores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 3,
                    color: theme.palette.neutral[400],
                  }}
                >
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => {
                const owner = allUsers.find(
                  (user) => user.id === store.ownerId,
                );

                return (
                  <TableRow key={store.id} hover>
                    <TableCell
                      sx={{
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            background: "#a29bfe44",
                          }}
                        >
                          <Store
                            sx={{
                              fontSize: 14,
                            }}
                          />
                        </Avatar>

                        <Typography variant="body2" fontWeight={600}>
                          {store.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {store.email}
                    </TableCell>

                    <TableCell
                      sx={{
                        borderColor: "rgba(255,255,255,0.04)",
                        maxWidth: 180,
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {store.address}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {owner ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 11,
                              background: "#a29bfe44",
                            }}
                          >
                            {owner.name?.[0] || "?"}
                          </Avatar>

                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: 120,
                            }}
                          >
                            {owner.name?.split(" ")[0]}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#ff767580",
                          }}
                        >
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <StarRate
                          sx={{
                            color: "#ffd166",
                            fontSize: 16,
                          }}
                        />

                        <Typography variant="body2" fontWeight={600}>
                          {store.overallRating !== null &&
                          store.overallRating !== undefined
                            ? store.overallRating
                            : "—"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ───────────────── Add User Dialog ───────────────── */}

      <Dialog
        open={userDialog}
        onClose={() => {
          if (!creatingUser) {
            setUserDialog(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: theme.palette.background.alt,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>

        <DialogContent>
          {userApiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {userApiError}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Full Name"
              value={userForm.name}
              onChange={(e) => {
                setUserForm({
                  ...userForm,
                  name: e.target.value,
                });

                setUserErrors({
                  ...userErrors,
                  name: undefined,
                });

                setUserApiError("");
              }}
              error={!!userErrors.name}
              helperText={
                userErrors.name || `${userForm.name.length}/60 chars (min 20)`
              }
              size="small"
              fullWidth
              disabled={creatingUser}
            />

            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => {
                setUserForm({
                  ...userForm,
                  email: e.target.value,
                });

                setUserErrors({
                  ...userErrors,
                  email: undefined,
                });

                setUserApiError("");
              }}
              error={!!userErrors.email}
              helperText={userErrors.email}
              size="small"
              fullWidth
              disabled={creatingUser}
            />

            <TextField
              label="Address"
              multiline
              rows={2}
              value={userForm.address}
              onChange={(e) => {
                setUserForm({
                  ...userForm,
                  address: e.target.value,
                });

                setUserErrors({
                  ...userErrors,
                  address: undefined,
                });
                setUserApiError("");
              }}
              error={!!userErrors.address}
              helperText={
                userErrors.address || `${userForm.address.length}/400 chars`
              }
              size="small"
              fullWidth
              disabled={creatingUser}
            />

            <TextField
              label="Password"
              type="password"
              value={userForm.password}
              onChange={(e) => {
                setUserForm({
                  ...userForm,
                  password: e.target.value,
                });

                setUserErrors({
                  ...userErrors,
                  password: undefined,
                });

                setUserApiError("");
              }}
              error={!!userErrors.password}
              helperText={
                userErrors.password || "8–16 chars, uppercase + special char"
              }
              size="small"
              fullWidth
              disabled={creatingUser}
            />

            <FormControl size="small" fullWidth disabled={creatingUser}>
              <InputLabel>Role</InputLabel>

              <Select
                value={userForm.role}
                label="Role"
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    role: e.target.value,
                  })
                }
              >
                <MenuItem value="NORMAL_USER">Normal User</MenuItem>

                <MenuItem value="ADMIN">System Administrator</MenuItem>

                <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUserDialog(false)} disabled={creatingUser}>
            Cancel
          </Button>

          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={creatingUser}
            sx={{
              background: "linear-gradient(135deg, #ffd166, #ff9a3c)",
              color: "#1a1a2e",
              fontWeight: 700,
            }}
          >
            {creatingUser ? "Adding..." : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ───────────────── Add Store Dialog ───────────────── */}

      <Dialog
        open={storeDialog}
        onClose={() => {
          if (!creatingStore) {
            setStoreDialog(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: theme.palette.background.alt,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Store</DialogTitle>

        <DialogContent>
          {storeApiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {storeApiError}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Store Name"
              value={storeForm.name}
              onChange={(e) => {
                setStoreForm({
                  ...storeForm,
                  name: e.target.value,
                });

                setStoreErrors({
                  ...storeErrors,
                  name: undefined,
                });

                setStoreApiError("");
              }}
              error={!!storeErrors.name}
              helperText={storeErrors.name}
              size="small"
              fullWidth
              disabled={creatingStore}
            />

            <TextField
              label="Email"
              type="email"
              value={storeForm.email}
              onChange={(e) => {
                setStoreForm({
                  ...storeForm,
                  email: e.target.value,
                });

                setStoreErrors({
                  ...storeErrors,
                  email: undefined,
                });
                setStoreApiError("");
              }}
              error={!!storeErrors.email}
              helperText={storeErrors.email}
              size="small"
              fullWidth
              disabled={creatingStore}
            />

            <TextField
              label="Address"
              multiline
              rows={2}
              value={storeForm.address}
              onChange={(e) => {
                setStoreForm({
                  ...storeForm,
                  address: e.target.value,
                });

                setStoreErrors({
                  ...storeErrors,
                  address: undefined,
                });
                setStoreApiError("");
              }}
              error={!!storeErrors.address}
              helperText={storeErrors.address}
              size="small"
              fullWidth
              disabled={creatingStore}
            />

            <FormControl
              size="small"
              fullWidth
              error={!!storeErrors.ownerId}
              disabled={creatingStore}
            >
              <InputLabel>Store Owner</InputLabel>

              <Select
                value={storeForm.ownerId}
                label="Store Owner"
                onChange={(e) => {
                  setStoreForm({
                    ...storeForm,
                    ownerId: e.target.value,
                  });

                  setStoreErrors({
                    ...storeErrors,
                    ownerId: undefined,
                  });

                  setStoreApiError("");
                }}
              >
                {availableStoreOwners.length === 0 ? (
                  <MenuItem disabled value="">
                    {storeOwnersCount === 0
                      ? "No store owner users exist — add a Store Owner user first"
                      : "All store owners already have a store assigned"}
                  </MenuItem>
                ) : (
                  availableStoreOwners.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: 11,
                            background: "#a29bfe44",
                          }}
                        >
                          {user.name?.[0] || "?"}
                        </Avatar>

                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: "#a29bfe",
                            }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>

              {storeErrors.ownerId && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#f44336",
                    mt: 0.5,
                    ml: 1.5,
                  }}
                >
                  {storeErrors.ownerId}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setStoreDialog(false)}
            disabled={creatingStore}
          >
            Cancel
          </Button>

          <Button
            onClick={handleAddStore}
            variant="contained"
            disabled={creatingStore}
            sx={{
              background: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {creatingStore ? "Adding..." : "Add Store"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
