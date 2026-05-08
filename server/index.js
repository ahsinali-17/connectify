import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; 
import path from "path";
import { fileURLToPath } from "url"; 
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
app.use(cors(corsOptions)); //decides which domain can access the server resources
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*Mongoose Setup*/
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {console.log("MongoDB connected")})
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