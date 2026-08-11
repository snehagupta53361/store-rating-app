import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  useTheme,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Store,
  StarRate,
  LocationOn,
  Email,
  Edit,
} from "@mui/icons-material";
import Header from "components/common/Header.jsx";
import {
  useGetAllStoresQuery,
  useSubmitRatingMutation,
} from "../../store/api/storeApi.js";

const StoreList = () => {
  const theme = useTheme();
  const currentUser = useSelector((s) => s.global.currentUser);

  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [rateDialog, setRateDialog] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isUser = currentUser?.role === "NORMAL_USER";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: stores = [],
    isLoading,
    isFetching,
    isError,
    error: storesError,
  } = useGetAllStoresQuery(
    debouncedSearch
      ? {
          [searchField]: debouncedSearch,
        }
      : {},
  );

  const [submitRating, { isLoading: isSubmittingRating }] =
    useSubmitRatingMutation();

  useEffect(() => {
    if (isError) {
      setErrorMsg(
        storesError?.data?.message ||
          storesError?.message ||
          "Failed to load stores. Ensure the database is running.",
      );
    } else {
      setErrorMsg("");
    }
  }, [isError, storesError]);

  const openRateDialog = (store) => {
    setSelectedRating(store.myRating || 0);
    setRateDialog(store);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating) return;

    try {
      setErrorMsg("");

      await submitRating({
        storeId: rateDialog.id,
        rating: selectedRating,
      }).unwrap();

      setRateDialog(null);

      setSuccessMsg(`Your rating for "${rateDialog.name}" has been submitted!`);

      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to submit rating.",
      );

      setRateDialog(null);
    }
  };

  const bg = theme.palette.background.alt;

  const border =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)";

  /*
   * Initial loading state.
   */
  if (isLoading) {
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

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="STORE DIRECTORY" subtitle="Browse and rate stores" />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>
          {successMsg}
        </Alert>
      )}

      {/* Search */}
      <Box mb={4} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          select
          label="Search By"
          value={searchField}
          onChange={(e) => {
            setSearchField(e.target.value);
            setSearch("");
            setDebouncedSearch("");
          }}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="address">Address</MenuItem>
        </TextField>

        <TextField
          placeholder={
            searchField === "name"
              ? "Search stores by name..."
              : "Search stores by address..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  sx={{
                    color: theme.palette.neutral[400],
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: isFetching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
          sx={{
            width: { xs: "100%", sm: 360 },
          }}
        />
      </Box>

      {/* Summary chips */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Chip
          icon={<Store />}
          label={`${stores.length} Stores`}
          sx={{
            background: "#a29bfe22",
            color: "#a29bfe",
          }}
        />

        {debouncedSearch && (
          <Chip
            label={`${stores.length} results for "${debouncedSearch}"`}
            sx={{
              background: "#55efc422",
              color: "#55efc4",
            }}
          />
        )}
      </Box>

      {/* Store Cards */}
      {stores.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Store
            sx={{
              fontSize: 64,
              color: theme.palette.neutral[400],
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              color: theme.palette.neutral[400],
            }}
          >
            {debouncedSearch
              ? `No stores found matching "${debouncedSearch}"`
              : "No stores available"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stores.map((store) => {
            const avg = store.overallRating;
            const myRating = store.myRating;
            const catColor = "#ffd166";

            return (
              <Grid item xs={12} sm={6} md={4} key={store.id}>
                <Card
                  sx={{
                    background: bg,
                    borderRadius: "16px",
                    border: `1px solid ${border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",

                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 16px 40px ${catColor}20`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      background: `linear-gradient(90deg, ${catColor}, ${catColor}88)`,
                      borderRadius: "16px 16px 0 0",
                    }}
                  />

                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: `${catColor}22`,
                          border: `2px solid ${catColor}44`,
                        }}
                      >
                        <Store
                          sx={{
                            color: catColor,
                          }}
                        />
                      </Avatar>
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mb={1}
                      sx={{
                        lineHeight: 1.3,
                      }}
                    >
                      {store.name}
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="flex-start"
                      gap={0.5}
                      mb={1}
                    >
                      <LocationOn
                        sx={{
                          fontSize: 14,
                          color: theme.palette.neutral[400],
                          mt: 0.3,
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.neutral[400],
                          lineHeight: 1.4,
                        }}
                      >
                        {store.address}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                      <Email
                        sx={{
                          fontSize: 14,
                          color: theme.palette.neutral[400],
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        {store.email}
                      </Typography>
                    </Box>

                    {/* Average Rating */}
                    <Box
                      sx={{
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.03)",
                        borderRadius: "12px",
                        p: 1.5,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.neutral[400],
                            }}
                          >
                            Overall Rating
                          </Typography>

                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography
                              variant="h5"
                              fontWeight={800}
                              sx={{
                                color: "#ffd166",
                              }}
                            >
                              {avg !== null && avg !== undefined ? avg : "—"}
                            </Typography>

                            <StarRate
                              sx={{
                                color: "#ffd166",
                                fontSize: 20,
                              }}
                            />
                          </Box>

                          <Rating
                            value={avg || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* My Rating badge */}
                    {myRating !== null && myRating !== undefined && (
                      <Box mt={1.5} display="flex" alignItems="center" gap={1}>
                        <Chip
                          icon={
                            <StarRate
                              sx={{
                                fontSize: 14,
                              }}
                            />
                          }
                          label={`Your rating: ${myRating}`}
                          size="small"
                          sx={{
                            background: "#ffd16622",
                            color: "#ffd166",
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>

                  {/* Rate button (only for normal users) */}
                  {isUser && (
                    <CardActions
                      sx={{
                        p: 2,
                        pt: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        variant={myRating ? "outlined" : "contained"}
                        startIcon={myRating ? <Edit /> : <StarRate />}
                        onClick={() => openRateDialog(store)}
                        sx={
                          myRating
                            ? {
                                borderColor: "#ffd16660",
                                color: "#ffd166",
                                borderRadius: "10px",

                                "&:hover": {
                                  borderColor: "#ffd166",
                                  background: "#ffd16615",
                                },
                              }
                            : {
                                background:
                                  "linear-gradient(135deg, #ffd166, #ff9a3c)",
                                color: "#1a1a2e",
                                fontWeight: 700,
                                borderRadius: "10px",

                                "&:hover": {
                                  boxShadow: "0 6px 20px rgba(255,209,102,0.4)",
                                },
                              }
                        }
                      >
                        {myRating ? "Update Rating" : "Rate this Store"}
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Rating Dialog */}
      <Dialog
        open={!!rateDialog}
        onClose={() => setRateDialog(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: bg,
          },
        }}
      >
        {rateDialog && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                pb: 1,
              }}
            >
              Rate: {rateDialog.name}
            </DialogTitle>

            <DialogContent>
              <Box textAlign="center" py={2}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.neutral[400],
                    mb: 3,
                  }}
                >
                  Select your rating for this store
                </Typography>

                <Rating
                  value={selectedRating}
                  onChange={(_, newValue) => setSelectedRating(newValue)}
                  size="large"
                  sx={{
                    fontSize: 48,

                    "& .MuiRating-iconFilled": {
                      color: "#ffd166",
                    },

                    "& .MuiRating-iconHover": {
                      color: "#ffdc80",
                    },
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: "#ffd166",
                    mt: 1,
                  }}
                >
                  {selectedRating > 0
                    ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                        selectedRating
                      ]
                    : "—"}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: 2,
                pt: 0,
              }}
            >
              <Button onClick={() => setRateDialog(null)}>Cancel</Button>

              <Button
                onClick={handleSubmitRating}
                variant="contained"
                disabled={!selectedRating || isSubmittingRating}
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
                {isSubmittingRating ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StoreList;
