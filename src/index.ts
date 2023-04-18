import connectDB from "./config/conn";
import errorHandler from "./middleware/errorMiddleware";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

connectDB();
const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/post", require("./routes/postRoutes"));

app.listen(5000, () => console.log("Server is running on PORT 5000"));
