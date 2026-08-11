import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Rating,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { StarRate, People, Store } from "@mui/icons-material";
import Header from "components/common/Header.jsx";
import { useGetDashboardQuery } from "../../store/api/dashboardApi.js";

const StoreOwnerDashboard = () => {
  const theme = useTheme();

  const {
    data: storeData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetDashboardQuery();

  const bg = theme.palette.background.alt;

  const border =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)";

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

  /*
   * API error
   */
  if (isError) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="MY STORE" subtitle="Store owner dashboard" />

        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: "10px",
          }}
        >
          {error?.data?.message ||
            error?.message ||
            "Failed to load dashboard data."}
        </Alert>
      </Box>
    );
  }

  /*
   * No store assigned
   */
  if (!storeData || !storeData.store) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="MY STORE" subtitle="Store owner dashboard" />

        <Card
          sx={{
            background: bg,
            borderRadius: "16px",
            mt: 4,
            p: 4,
            textAlign: "center",
          }}
        >
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
              color: theme.palette.neutral[300],
            }}
          >
            No store assigned to your account yet.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.neutral[400],
              mt: 1,
            }}
          >
            Please contact an administrator to link a store to your profile.
          </Typography>
        </Card>
      </Box>
    );
  }

  const { store, averageRating, totalRatings, raters = [] } = storeData;

  const distributionMap = raters.reduce((acc, rater) => {
    const rating = Number(rater.rating);

    if (rating >= 1 && rating <= 5) {
      acc[rating] = (acc[rating] || 0) + 1;
    }

    return acc;
  }, {});

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: distributionMap[star] || 0,
  }));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MY STORE" subtitle={`Dashboard for ${store.name}`} />

      {/* Store Info + Stats */}
      <Grid container spacing={3} mb={4} mt={1}>
        {/* Store Details Card */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              background: bg,
              borderRadius: "16px",
              border: `1px solid ${border}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
                    fontSize: 24,
                  }}
                >
                  <Store />
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {store.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.neutral[400],
                    }}
                  >
                    Registered Store
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.neutral[400],
                    }}
                  >
                    Email
                  </Typography>

                  <Typography variant="body2">{store.email}</Typography>
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

                  <Typography variant="body2">{store.address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3} height="100%">
            {/* Average Rating */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  background: bg,
                  borderRadius: "16px",
                  border: `1px solid ${border}`,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px #ffd16630",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <StarRate
                    sx={{
                      color: "#ffd166",
                      fontSize: 48,
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      color: "#ffd166",
                    }}
                  >
                    {averageRating !== null && averageRating !== undefined
                      ? averageRating
                      : "—"}
                  </Typography>

                  <Rating
                    value={averageRating || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{ mt: 0.5 }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.neutral[400],
                      mt: 1,
                    }}
                  >
                    Average Rating
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Ratings */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  background: bg,
                  borderRadius: "16px",
                  border: `1px solid ${border}`,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px #a29bfe30",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <People
                    sx={{
                      color: "#a29bfe",
                      fontSize: 48,
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      color: "#a29bfe",
                    }}
                  >
                    {totalRatings}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.neutral[400],
                      mt: 1,
                    }}
                  >
                    Total Ratings Received
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Rating Distribution */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: bg,
                  borderRadius: "16px",
                  border: `1px solid ${border}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    mb={2}
                    sx={{
                      color: theme.palette.neutral[300],
                    }}
                  >
                    Rating Distribution
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1}>
                    {ratingDistribution.map(({ star, count }) => {
                      const pct =
                        totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                      return (
                        <Box
                          key={star}
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              minWidth: 16,
                              color: "#ffd166",
                              fontWeight: 700,
                            }}
                          >
                            {star}★
                          </Typography>

                          <Box
                            flex={1}
                            height={8}
                            borderRadius={4}
                            sx={{
                              background: "rgba(255,255,255,0.08)",
                            }}
                          >
                            <Box
                              height="100%"
                              borderRadius={4}
                              sx={{
                                width: `${pct}%`,
                                background:
                                  "linear-gradient(90deg, #ffd166, #ff9a3c)",
                                transition: "width 0.6s ease",
                              }}
                            />
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              minWidth: 20,
                              color: theme.palette.neutral[400],
                            }}
                          >
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Raters Table */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}
        flexWrap="wrap"
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: theme.palette.neutral[100] || theme.palette.text.primary,
            }}
          >
            Users Who Rated Your Store
          </Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          background: bg,
          borderRadius: "16px",
          border: `1px solid ${border}`,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {["User", "Email", "Rating"].map((heading) => (
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
            {raters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    py: 4,
                    color: theme.palette.neutral[400],
                  }}
                ></TableCell>
              </TableRow>
            ) : (
              raters.map((rater) => (
                <TableRow key={rater.id} hover>
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
                          background: "#55efc444",
                        }}
                      >
                        {rater.name?.[0] || "?"}
                      </Avatar>

                      <Typography variant="body2">
                        {rater.name || "Unknown"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {rater.email || "—"}
                  </TableCell>

                  <TableCell
                    sx={{
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Rating value={rater.rating} readOnly size="small" />

                      <Chip
                        label={rater.rating}
                        size="small"
                        sx={{
                          background: "#ffd16622",
                          color: "#ffd166",
                          ml: 0.5,
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StoreOwnerDashboard;
