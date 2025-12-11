import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postreducer from "./reducer/postReducer"
import { Podcasts } from "@mui/icons-material";

/*
 *Steps for state Management
 * submit action
 * handle action in it's reducer
 * register Here -> reducer  */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts : postreducer
  },
});
