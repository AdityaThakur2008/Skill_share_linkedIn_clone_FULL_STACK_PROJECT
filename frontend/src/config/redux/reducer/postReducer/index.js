import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComment,
  getAllPosts,
  increment_like,
} from "../../action/postAction";

const initialState = {
  posts: [],

  isError: false,
  postFatched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  error: null,

  comments: [],
  postId: "",
};

const postSclice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFatched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        (state.isLoading = true),
          (state.message = " creating post please wait..");
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.message = action.payload.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.message = action.payload.message;
      })
      .addCase(getAllComment.fulfilled, (state, action) => {
        state.postId = action.payload.postId;
        state.comments = action.payload.allcomments;
      });
  },
});

export const { resetPostId, reset } = postSclice.actions;
export default postSclice.reducer;
