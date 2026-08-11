import { apiSlice } from "./apiSlice";
import { API_PATHS } from "../../utils/apiPaths";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => ({
        url: API_PATHS.DASHBOARD.BASE,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
