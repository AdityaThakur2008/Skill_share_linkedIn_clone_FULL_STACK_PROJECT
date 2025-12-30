import { createSlice } from "@reduxjs/toolkit";
import {
  get_all_usersProfile,
  getUserProfile,
  loginUser,
  registerUser,
  sendConnectionRequest,
} from "../../action/authAction";

const initialState = {
  user: {},

  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isToken: false,
  error: null,
  profileFetched: false,
  all_users: [],
  connections: [],
  connectionRequest: [],
  all_profile_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "false";
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },

    setistokenthere: (state) => {
      state.isToken = true;
    },
    setIsTokenNotThere: (state) => {
      state.isToken = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.loggedIn = true;
        state.message = "login is successfull";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.message = "register seccessfull..,please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.User_profile;
      })
      .addCase(get_all_usersProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profile_fetched = true;
        state.all_users = action.payload.allProfile;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        console.log("send connection succegull");
      });
  },
});

export const {
  reset,
  handleLoginUser,
  clearMessage,
  setIsTokenNotThere,
  setistokenthere,
} = authSlice.actions;
export default authSlice.reducer;
