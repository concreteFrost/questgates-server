import express from "express";
import router from "@routes/index";

const app = express();

app.use(express.json());
app.use("/api", router);

// //error handler middleware
// app.use(errorHandler);

export default app;
