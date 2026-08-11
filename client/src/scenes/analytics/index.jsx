import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PieChartOutlined,
  BarChartOutlined,
  Store,
  StarRate,
} from "@mui/icons-material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

import { useGetAllStoresQuery } from "../../store/api/storeApi.js";
import { useGetDashboardQuery } from "../../store/api/dashboardApi.js";
import Header from "components/common/Header.jsx";

// ─────────────────────────────────────────────
// Custom Nivo Theme
// ─────────────────────────────────────────────

const getNivoTheme = (theme) => ({
  text: {
    fontSize: 11,
    fill: theme.palette.neutral[300] || "#999",
    fontFamily: theme.typography.fontFamily,
  },

  axis: {
    domain: {
      line: {
        stroke:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        strokeWidth: 1,
      },
    },

    ticks: {
      line: {
        stroke:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        strokeWidth: 1,
      },

      text: {
        fill: theme.palette.neutral[300] || "#999",
      },
    },
  },

  grid: {
    line: {
      stroke:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)",
      strokeWidth: 1,
    },
  },

  legends: {
    text: {
      fill: theme.palette.neutral[200] || "#ccc",
    },
  },

  tooltip: {
    container: {
      background: theme.palette.background.alt,
      color: theme.palette.neutral[100] || "#fff",
      fontSize: 12,
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      border: `1px solid ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.08)"
      }`,
    },
  },
});

// ─────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────

const Analytics = () => {
  const theme = useTheme();

  const currentUser = useSelector((state) => state.global.currentUser);

  const role = currentUser?.role;

  const isAdmin = role === "ADMIN";
  const isNormalUser = role === "NORMAL_USER";
  const isStoreOwner = role === "STORE_OWNER";

  // ─────────────────────────────────────────────
  // Stores API
  //
  // ADMIN + NORMAL_USER need the store list.
  // STORE_OWNER does not.
  // ─────────────────────────────────────────────

  const {
    data: stores = [],
    isLoading: storesLoading,
    isError: storesIsError,
    error: storesError,
  } = useGetAllStoresQuery(undefined, {
    skip: !isAdmin && !isNormalUser,
  });

  // ─────────────────────────────────────────────
  // Dashboard API
  //
  // STORE_OWNER needs dashboard data.
  // ADMIN + NORMAL_USER do not.
  // ─────────────────────────────────────────────

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardIsError,
    error: dashboardError,
  } = useGetDashboardQuery(undefined, {
    skip: !isStoreOwner,
  });

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────

  if (storesLoading || dashboardLoading) {
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

  // ─────────────────────────────────────────────
  // Error
  // ─────────────────────────────────────────────

  if (storesIsError || dashboardIsError) {
    const error = storesError || dashboardError;

    const message =
      error?.data?.message ||
      error?.message ||
      "Failed to load analytics data.";

    return (
      <Box m="1.5rem 2.5rem">
        <Header
          title="ANALYTICS & INSIGHTS"
          subtitle="Interactive charts and data visualizations"
        />

        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: "10px",
          }}
        >
          {message}
        </Alert>
      </Box>
    );
  }

  // ─────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────

  const nivoTheme = getNivoTheme(theme);

  const bg = theme.palette.background.alt;

  const border =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)";

  // ─────────────────────────────────────────────
  // Store Rating Bar Data
  //
  // Used by ADMIN + NORMAL_USER
  // ─────────────────────────────────────────────

  const barData = stores.map((store) => ({
    storeName: store.name?.split(" ")[0] || "Store",

    "Avg Rating": store.overallRating ?? 0,
  }));

  // ─────────────────────────────────────────────
  // Admin Rating Distribution
  // ─────────────────────────────────────────────

  const ratingDistributionAdmin = stores.reduce(
    (acc, store) => {
      const rating = store.overallRating;

      if (rating === null || rating === undefined) {
        acc.unrated += 1;
      } else if (rating >= 4) {
        acc.high += 1;
      } else if (rating >= 2.5) {
        acc.medium += 1;
      } else {
        acc.low += 1;
      }

      return acc;
    },
    {
      high: 0,
      medium: 0,
      low: 0,
      unrated: 0,
    },
  );

  const pieDataAdmin = [
    {
      id: "Highly Rated (4-5★)",
      label: "Highly Rated",
      value: ratingDistributionAdmin.high,
      color: "#55efc4",
    },
    {
      id: "Medium Rated (2.5-4★)",
      label: "Medium Rated",
      value: ratingDistributionAdmin.medium,
      color: "#ffd166",
    },
    {
      id: "Low Rated (1-2.5★)",
      label: "Low Rated",
      value: ratingDistributionAdmin.low,
      color: "#ff7675",
    },
    {
      id: "Unrated",
      label: "Unrated",
      value: ratingDistributionAdmin.unrated,
      color: "#a29bfe",
    },
  ].filter((item) => item.value > 0);

  // ─────────────────────────────────────────────
  // Store Owner Rating Distribution
  // ─────────────────────────────────────────────

  const raters = dashboardData?.raters || [];

  const distributionData = [1, 2, 3, 4, 5].map((star) => ({
    stars: `${star}★`,
    count: raters.filter((rater) => rater.rating === star).length,
  }));

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="ANALYTICS & INSIGHTS"
        subtitle="Interactive charts and data visualizations"
      />

      {/* ══════════════════════════════════════════
          ADMIN ANALYTICS
         ══════════════════════════════════════════ */}

      {isAdmin && (
        <Grid container spacing={3} mt={1}>
          {/* Store Ratings Comparison */}

          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: bg,
                borderRadius: "20px",
                border: `1px solid ${border}`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Avatar
                    sx={{
                      background: "#ffd16622",
                      color: "#ffd166",
                    }}
                  >
                    <BarChartOutlined />
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Store Ratings Comparison
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Comparing Average Store Performance in the System
                    </Typography>
                  </Box>
                </Box>

                <Box height={350}>
                  {barData.length === 0 ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        No store data available
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsiveBar
                      data={barData}
                      keys={["Avg Rating"]}
                      indexBy="storeName"
                      margin={{
                        top: 20,
                        right: 30,
                        bottom: 50,
                        left: 40,
                      }}
                      padding={0.3}
                      valueScale={{
                        type: "linear",
                        min: 0,
                        max: 5,
                      }}
                      colors="#ffd166"
                      theme={nivoTheme}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickValues: [0, 1, 2, 3, 4, 5],
                      }}
                      labelTextColor="#1a1a2e"
                      role="application"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Rating Distribution */}

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: bg,
                borderRadius: "20px",
                border: `1px solid ${border}`,
                height: "100%",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Avatar
                    sx={{
                      background: "#55efc422",
                      color: "#55efc4",
                    }}
                  >
                    <PieChartOutlined />
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Rating Distribution
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Share of stores by rating brackets
                    </Typography>
                  </Box>
                </Box>

                <Box height={350} position="relative">
                  {pieDataAdmin.length === 0 ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        No stores registered yet
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsivePie
                      data={pieDataAdmin}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 20,
                      }}
                      innerRadius={0.6}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      theme={nivoTheme}
                      colors={({ data }) => data.color}
                      borderWidth={1}
                      borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.2]],
                      }}
                      enableArcLinkLabels={false}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="#1a1a2e"
                      legends={[
                        {
                          anchor: "bottom",
                          direction: "column",
                          justify: false,
                          translateX: 0,
                          translateY: 50,
                          itemsSpacing: 4,
                          itemWidth: 150,
                          itemHeight: 12,
                          itemTextColor: theme.palette.neutral[300],
                          itemDirection: "left-to-right",
                          itemOpacity: 1,
                          symbolSize: 8,
                          symbolShape: "circle",
                        },
                      ]}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ══════════════════════════════════════════
          STORE OWNER ANALYTICS
         ══════════════════════════════════════════ */}

      {isStoreOwner && (
        <Grid container spacing={3} mt={1}>
          {dashboardData?.store ? (
            <Grid item xs={12} md={8} mx="auto">
              <Card
                sx={{
                  background: bg,
                  borderRadius: "20px",
                  border: `1px solid ${border}`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Avatar
                      sx={{
                        background: "#ffd16622",
                        color: "#ffd166",
                      }}
                    >
                      <StarRate />
                    </Avatar>

                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Rating Distribution
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        Breakdown of ratings from 1★ to 5★
                      </Typography>
                    </Box>
                  </Box>

                  <Box height={380}>
                    {raters.length === 0 ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.neutral[400],
                          }}
                        >
                          No ratings submitted yet
                        </Typography>
                      </Box>
                    ) : (
                      <ResponsiveBar
                        data={distributionData}
                        keys={["count"]}
                        indexBy="stars"
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 50,
                          left: 40,
                        }}
                        padding={0.3}
                        valueScale={{
                          type: "linear",
                        }}
                        colors="#ffd166"
                        theme={nivoTheme}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                        }}
                        labelTextColor="#1a1a2e"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Card
                sx={{
                  background: bg,
                  borderRadius: "16px",
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
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* ══════════════════════════════════════════
          NORMAL USER ANALYTICS
         ══════════════════════════════════════════ */}

      {isNormalUser && (
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: bg,
                borderRadius: "20px",
                border: `1px solid ${border}`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Avatar
                    sx={{
                      background: "#a29bfe22",
                      color: "#a29bfe",
                    }}
                  >
                    <BarChartOutlined />
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Store Ratings Overview
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.neutral[400],
                      }}
                    >
                      Comparison of Average Store Ratings in the Directory
                    </Typography>
                  </Box>
                </Box>

                <Box height={380}>
                  {barData.length === 0 ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.neutral[400],
                        }}
                      >
                        No store rating data available
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsiveBar
                      data={barData}
                      keys={["Avg Rating"]}
                      indexBy="storeName"
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 40,
                      }}
                      padding={0.3}
                      colors="#a29bfe"
                      theme={nivoTheme}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickValues: [0, 1, 2, 3, 4, 5],
                      }}
                      labelTextColor="#1a1a2e"
                      valueScale={{
                        type: "linear",
                        min: 0,
                        max: 5,
                      }}
                      indexScale={{
                        type: "band",
                        round: true,
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
