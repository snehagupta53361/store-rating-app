export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    UPDATE_PASSWORD: "/auth/update-password",
  },

  STORES: {
    BASE: "/stores",
    SUBMIT_RATING: (id) => `/stores/${id}/rating`,
  },

  USERS: {
    BASE: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
  },

  DASHBOARD: {
    BASE: "/dashboard",
  },
};
