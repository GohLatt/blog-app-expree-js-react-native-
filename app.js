const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./route/userRoute");
const postRoute = require("./route/postRoute");
const { notFound, globalError } = require("./middleware/errorMiddleWare");
const upload = require("express-fileupload");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

app.use(notFound);
app.use(globalError);

module.exports = app;
