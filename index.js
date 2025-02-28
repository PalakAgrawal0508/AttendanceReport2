import express from "express";
import dotenv from "dotenv";
import userRoute from "./src/routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// This is the studentReport Routes . 
import { studentReportRoutes } from "./src/routes/studentReport.routes.js";
import facultyReportRoutes from "./src/routes/facultyReport.routes.js";
import directorRoutes from "./src/routes/director.routes.js";

// import { studentRoutes } from "./src/routes/student.routes.js";
import morgan from "morgan";
dotenv.config();
import { ApplicationError } from "./src/errorHandle/error.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import jwtAuthProf from "./src/middleware/jwt.middleware.js";

 connectToMongoDB();
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json({ type: "application/*+json" }));
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(cookieParser());
const port = process.env.PORT || 3000;
var corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: "*",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  res.status(500).send("Something went wrong,please try later");
});
app.use(loggerMiddleware);
app.use("/api/student/",studentReportRoutes);
app.use("/api/faculty/", facultyReportRoutes);
app.use("/api/user/", userRoute);
app.use("/api/director/",directorRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Attendance Report APIs");
});
app.use((req, res) => {
  res.status(404).send("API not found.");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
  
});
