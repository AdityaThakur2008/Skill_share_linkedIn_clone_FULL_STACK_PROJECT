import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("uploads"));

app.use(postRoutes);
app.use(userRoutes);

const start = async () => {
  const connectToDb = await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch((err) => {
      console.log("failed to connect to mongoDB", err);
    });

  app.listen(8000, () => {
    console.log("server is listing on port 8000");
  });
};

start();
