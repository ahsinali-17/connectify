import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; //Middleware for handling multipart/form-data, used for uploading files.
import helmet from "helmet"; //Middleware for securing Express apps by setting various HTTP headers.
import morgan from "morgan"; //HTTP request logger middleware for node.js
import path from "path";
import { fileURLToPath } from "url"; //cant use __filename and __dirname in ES6 modules
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import passwordRoutes from "./routes/password.js";
import chatRoutes from "./routes/chats.js";
import { createPost } from "./controllers/posts.js";
import { updateUserPicture } from "./controllers/users.js";

const corsOptions = {
  origin: ['https://connectify-kohl-delta.vercel.app', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true, 
};

/* Middleware & Package Configurations*/
dotenv.config(); //load environment variables from .env file into process.env
const __filename = fileURLToPath(import.meta.url); //index.js file path
const __dirname = path.dirname(__filename); //server directory path
export const app = express();
app.use(express.json()); //parse application/json
app.use(bodyParser.json({ limit: "30mb", extended: true })); //parse application/json
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //parse form data in POST request
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //decides which resources can be requested from a other domain
app.use(cors('*')); //decides which domain can access the server resources
app.use(morgan("common")); //The 'common' format logs a predefined set of information in a concise way
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*Mongoose Setup*/
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`${err} did not connect`));

/*File Storage*/
const storage = multer.diskStorage({
  //whenever useer uploads a file on website it will be stored in the public/assets folder
  destination: (req, file, cb) => {
    //cb is callback function and file is the file that is being uploaded
    cb(null, "./public/assets"); //null is error and assets is the folder where file will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Welcome to Connectify API");
});

/*Routes with files*/ //this route included files, so it is handled separately
app.post("/auth/register", upload.single("picture"), register);
app.patch("/users/:id/changedp", upload.single("dp"), updateUserPicture);
app.post(
  "/addpost",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);
/* Routes */ 
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/password", passwordRoutes);
app.use("/chat", chatRoutes);