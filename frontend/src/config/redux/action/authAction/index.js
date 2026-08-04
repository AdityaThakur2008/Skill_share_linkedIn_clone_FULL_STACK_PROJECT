import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/config";

import { reset } from "../../reducer/authReducer";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await apiClient.post("/login", {
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
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
  },
);

export const getUserProfile = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/get_user_and_profile");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      const status = error.response?.status;
      if ([401, 403, 404].includes(status)) {
        thunkAPI.dispatch(reset());
      }

      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const get_all_usersProfile = createAsyncThunk(
  "/user/get_all_usersProfile",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/user/get_all_usersProfile");
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
export const sendConnectionRequest = createAsyncThunk(
  "/user/sendConnectionRequest",
  async (recipientId, thunkAPI) => {
    try {
      const response = await apiClient.post("/user/send_connection_request", {
        recipientId,
      });

      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
export const getMyConnections = createAsyncThunk(
  "/user/getMyConnections",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/user/MyConnections");
      return res.data.connections;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const receivedConnectionRequests = createAsyncThunk(
  "/user/getConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/user/getConnectionRequests");
      return res.data.receivedRequests;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const acceptOrRejectConnection = createAsyncThunk(
  "/user/acceptOrRejectConnection",
  async ({ requesterId, action_type }, thunkAPI) => {
    try {
      const res = await apiClient.post("/user/accept_connection_request", {
        requesterId,
        action_type,
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, thunkAPI) => {
    try {
      await apiClient.post("/update_profile", profileData);

      return profileData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateProfilePicture = createAsyncThunk(
  "profile/updateProfilePicture",
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("profile_picture", file);

      await apiClient.post("/update_profile_picture", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return true;
    } catch (err) {
      return rejectWithValue("Profile picture update failed");
    }
  },
);
