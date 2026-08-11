import { createSlice } from "@reduxjs/toolkit";

const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const loadRaw = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored || fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  } catch {}
};

const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

const initialState = {
  mode: "dark",
  currentUser: load("currentUser", null),
  token: loadRaw("token", null),
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.currentUser = user;
      state.token = token;
      save("currentUser", user);
      save("token", token);
    },
    clearCredentials: (state) => {
      state.currentUser = null;
      state.token = null;
      remove("currentUser");
      remove("token");
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      save("currentUser", state.currentUser);
    },
  },
});

export const { setMode, setCredentials, clearCredentials, updateCurrentUser } =
  globalSlice.actions;

export default globalSlice.reducer;
