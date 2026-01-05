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
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/user/get_all_usersProfile");
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
export const sendConnectionRequest = createAsyncThunk(
  "/user/sendConnectionRequest",
  async (recipientId, thunkAPI) => {
    try {
      const response = await apiClient.post("/user/send_connection_request", {
        recipientId: recipientId,
        token: localStorage.getItem("token"),
      });
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
export const getMyConnections = createAsyncThunk(
  "/user/getMyConnections",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/user/MyConnections", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return res.data.connections;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const receivedConnectionRequests = createAsyncThunk(
  "/user/getConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/user/getConnectionRequests", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return res.data.receivedRequests;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const acceptOrRejectConnection = createAsyncThunk(
  "/user/acceptOrRejectConnection",
  async ({ requesterId, action_type }, thunkAPI) => {
    try {
      const res = await apiClient.post("/user/acceptOrRejectConnection", {
        requesterId,
        action_type,
        token: localStorage.getItem("token"),
      });

      return res.data; // { message, connection }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);
