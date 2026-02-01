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
    origin: [
      "http://localhost:3000",
      "https://skill-share-linked-in-clo-git-7abb42-adityathakur2008s-projects.vercel.app",
      "https://skill-share-linked-in-clone-full-stack-project-a2y54yu6q.vercel.app",
    ],

    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static("uploads"));

app.use(postRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 8000;

const start = async () => {
  const connectToDb = await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch((err) => {
      console.log("failed to connect to mongoDB", err);
    });

  app.listen(PORT, () => {
    console.log("server is listing on port 8000");
  });
};

start();
