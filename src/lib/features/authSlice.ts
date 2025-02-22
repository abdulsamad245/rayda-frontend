import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { setCookie, removeCookie } from "../utils/cookies";;
import { AxiosError } from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const response = await axios.post("/register", userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Registration failed. Please try again!");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: { email: string; password: string }) => {
    try {
      const response = await axios.post("/login", userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Signin failed. Please try again!");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await axios.post("/logout");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(`${axiosError?.message}!` || "Failed to logout. Please try again!");
  }
});

interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        setCookie("token", action.payload.data.token);
        setCookie("username", action.payload.data.user.name);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signin failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        removeCookie("token");
        removeCookie("username");
      });
  },
});

export default authSlice.reducer;
