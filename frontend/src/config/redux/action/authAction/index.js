import { apiClient } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await apiClient.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await apiClient.post("/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/get_user_and_profile", {
        params: {
          token: localStorage.getItem("token"),
        },
      });

      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const get_all_usersProfile = createAsyncThunk(
  "/user/get_all_usersProfile",
  async (_ , thunkAPI) => {
    try {
      const response = await apiClient.get("/user/get_all_usersProfile")
      return thunkAPI.fulfillWithValue(response?.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
)
