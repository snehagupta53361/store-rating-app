import { apiSlice } from "./apiSlice";
import { API_PATHS } from "../../utils/apiPaths";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ name, email, address, password, role }) => ({
        url: API_PATHS.USERS.BASE,
        method: "POST",
        data: { name, email, address, password, role },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    getAllUsers: builder.query({
      query: (params = {}) => ({
        url: API_PATHS.USERS.BASE,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Users", id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: API_PATHS.USERS.GET_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} = usersApi;
