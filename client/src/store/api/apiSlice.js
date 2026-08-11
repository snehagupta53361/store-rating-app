import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../utils/axiosInstance";

const axiosBaseQuery =
  () =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const response = await axiosInstance({ url, method, data, params });
      return { data: response.data };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "Stores", "Users", "Dashboard"],
  endpoints: () => ({}),
});
