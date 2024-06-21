import createError from 'http-errors';
import express from 'express';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/ingredients.js';
import usersRouter from './routes/users.js';

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/',(req, res)=>{
res.send('Hello')
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({err: err.message});
});


export default app;
