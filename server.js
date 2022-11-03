import * as dotenv from 'dotenv';
dotenv.config()

import Debug from 'debug';
const debugMain = Debug("app:server");
const debugError = Debug("app:error");
import config from 'config';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { bugRouter } from './routes/api/bug.js';
import { userRouter } from './routes/api/user.js';
import { commentRouter } from './routes/api/comments.js';
import { auth } from './middleware/auth.js';


// Create Application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Register Middleware Application Wide
app.use('./middleware/auth', (req, res, next) => {
  debugMain('Auth Middleware Moving..');
  next();
} );

// Register Routes
app.use('/api/user', userRouter);
app.use('/api/bug', bugRouter);
app.use('/api/comment', commentRouter);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('/', (req, res, next) => {
//   debugMain('Home Page');
//   res.type("text/plain").send('Home Page');
// });

// register error handlers
app.use((req, res, next) => {
  debugError(`Sorry, we couldn't find ${req.originalUrl}`);
  res.status(404)
     .json({ error: `Sorry, we couldn't find ${req.originalUrl}`});
});

app.use((err, req, res, next) => {
  debugError(err);
  res.status(err.status || 500)
     .json({ error: err.message});
});

// Listen for Requests
const hostname = config.get('http.host');
const port = config.get('http.port');
app.listen(port, () => {
  console.log('\n')
  debugMain(`Server running at http://${hostname}:${port}`);
  console.log('\n');
});