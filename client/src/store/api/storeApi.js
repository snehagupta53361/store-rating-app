import { apiSlice } from "./apiSlice";
import { API_PATHS } from "../../utils/apiPaths";

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createStore: builder.mutation({
      query: ({ name, email, address, ownerId }) => ({
        url: API_PATHS.STORES.BASE,
        method: "POST",
        data: { name, email, address, ownerId },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Stores"],
    }),

    getAllStores: builder.query({
      query: (params = {}) => ({
        url: API_PATHS.STORES.BASE,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Stores", id })),
              { type: "Stores", id: "LIST" },
            ]
          : [{ type: "Stores", id: "LIST" }],
    }),

    submitRating: builder.mutation({
      query: ({ storeId, rating }) => ({
        url: API_PATHS.STORES.SUBMIT_RATING(storeId),
        method: "POST",
        data: { rating },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { storeId }) => [
        { type: "Stores", id: storeId },
        { type: "Stores", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useGetAllStoresQuery,
  useSubmitRatingMutation,
} = storeApi;
