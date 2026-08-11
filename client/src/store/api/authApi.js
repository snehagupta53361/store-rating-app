import { apiSlice } from "./apiSlice";
import { API_PATHS } from "../../utils/apiPaths";
import { setCredentials } from "../slices/globalSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: API_PATHS.AUTH.LOGIN,
        method: "POST",
        data: { email, password },
      }),
      transformResponse: (response) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.user, token: data.token }));
      },
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: API_PATHS.AUTH.SIGNUP,
        method: "POST",
        data: userData,
      }),
      transformResponse: (response) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.user, token: data.token }));
      },
      invalidatesTags: ["Auth"],
    }),

    updatePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: API_PATHS.AUTH.UPDATE_PASSWORD,
        method: "PATCH",
        data: { currentPassword, newPassword },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useUpdatePasswordMutation,
} = authApi;
