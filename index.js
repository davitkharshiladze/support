require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const regularUsers = require("./routes/regularUsers");
const regularUserAuth = require("./routes/regularUserAuth");
const userAuth = require("./routes/userAuth");
const incidents = require("./routes/incidents");
const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

process.on("unhandledRejection", ex => {
  throw ex;
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: config.get("db"),
  level: "error"
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use("/api/regularUsers", regularUsers);
app.use("/api/regularUsers/auth", regularUserAuth);
app.use("/api/users/auth", userAuth);
app.use("/api/incidents", incidents);
app.use(error);

mongoose
  .connect(config.get("db"), { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`starting listening ${port} port`));
