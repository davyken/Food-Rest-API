import createError from 'http-errors';
import express from 'express';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/ingredients.js';
// import swagger from './swagger.yaml';


const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

// Initialize Swagger
// swagger(app);

// Root route handler
app.get("/", (req, res) => {
  res.send("Welcome to the Food Recipe API");
});

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

export default app;

