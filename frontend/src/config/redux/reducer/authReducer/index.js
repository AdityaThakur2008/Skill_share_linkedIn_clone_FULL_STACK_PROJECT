import { createSlice } from "@reduxjs/toolkit";
import {
  acceptOrRejectConnection,
  get_all_usersProfile,
  getMyConnections,
  getUserProfile,
  loginUser,
  receivedConnectionRequests,
  registerUser,
  sendConnectionRequest,
  updateProfilePicture,
  updateUserProfile,
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
      .addCase(sendConnectionRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const recipientId = action.meta.arg;

        state.connections.push({
          recipientId,
          status: "pending",
        });
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(receivedConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(acceptOrRejectConnection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptOrRejectConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const { requesterId, action_type } = action.meta.arg;

        state.connectionRequest = state.connectionRequest.filter(
          (req) => req.requester?._id !== requesterId,
        );

        if (action_type === "accept") {
          state.connections.push({
            requesterId,
            status: "connected",
          });
        }
      })
      .addCase(acceptOrRejectConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.user.bio = action.payload.bio;
        state.user.location = action.payload.location;
        state.user.skills = action.payload.skills;
        state.user.education = action.payload.education;
        state.user.workExperience = action.payload.workExperience;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
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
