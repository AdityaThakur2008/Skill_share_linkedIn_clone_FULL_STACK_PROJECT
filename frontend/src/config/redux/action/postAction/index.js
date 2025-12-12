import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/config";
import { Crete_Round } from "next/font/google";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/posts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      const formData = new FormData();
      formData.append("token", token);
      formData.append("body", post.text);

      if (post.file) {
        formData.append("media", post.file);
      }

      const response = await apiClient.post("/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 201) {
        thunkAPI.dispatch(getAllPosts());
        return thunkAPI.fulfillWithValue(response.data.message);
      } else {
        return thunkAPI.rejectWithValue(
          "Something went wrong. Post uploading failed"
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Something went wrong"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      const response = await apiClient.delete("/delete_post", {
        data: {
          token: token,
          postId: post.postId,
        },
      });

      if (response.status == 200) {
        thunkAPI.dispatch(getAllPosts());
        return thunkAPI.fulfillWithValue(response.data.message);
      } else {
        return thunkAPI.rejectWithValue(
          "Unable to delete the post. Something went wrong."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Something went wrong"
      );
    }
  }
);
export const increment_like = createAsyncThunk(
  "post/like",
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }
      const response = await apiClient.post("/increment_like", {
        token,
        postId,
      });
      if (response.status == 200) {
        thunkAPI.dispatch(getAllPosts());
        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue(
          "Unable to delete the post. Something went wrong."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Something went wrong"
      );
    }
  }
);

export const getAllComment = createAsyncThunk(
  "post/comments",
  async (postData, thunkAPI) => {
    try {
      const response = await apiClient.get("/get_comments", {
        params: {
          postId: postData._id,
        },
      });

      return thunkAPI.fulfillWithValue({
        postId: postData._id,
        comments: response.data,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Somthing went wrong"
      );
    }
  }
);

export const write_comment = createAsyncThunk(
  "post/writeComment",
  async (postData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      const response = await apiClient.post("/write_comment", {
        token: token,
        postId: postData.postId,
        body: postData.body,
      });
      return thunkAPI.fulfillWithValue({
        message: response.message,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Somthing went wrong"
      );
    }
  }
);
export const deleteComment = createAsyncThunk(
  "post/deleteCommnet",
  async (commentId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      const response = await apiClient.delete("/delete_comment", {
        data: { token: token, commentId },
      });

      return thunkAPI.fulfillWithValue({
        message: response.message,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Somthing went wrong"
      );
    }
  }
);
