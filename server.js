import * as dotenv from 'dotenv';
dotenv.config()

import Debug from 'debug';
const debugMain = Debug("app:server");
const debugError = Debug("app:error");
import config from 'config';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import url from 'url';
import { bugRouter } from './routes/api/bug.js';
import { userRouter } from './routes/api/user.js';
import { commentRouter } from './routes/api/comments.js';

// Here we create __dirname, which is an elusive way to create a saved string which
// equals the correctly formatted path of the directory of the file the code is 
// written in.

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Application

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Im not exactly sure what lines 49-52 do, or why it is here. I wrote it here because our
// lab assignment required students to, 'register auth middleware application wide'. I am 
// about to do a local test with this code commented out, and will note what happens in
// the next comment below.

// NOTE: What happened was that nothing happened because this project no longer has a quick
// transition to do a local test in. Lines 76-79 are commented out, and contain a replacement 
// for lines 70-74, which sets up the serving and use of our ReactJS build. In the next note, I  
// will describe what happens when I deploy to Heroku, and test using the Chrome browser. Inside
// my browser I will simply connect to 'https://bug-tracker-zackary-seger.herokuapp.com/bugList',
// where I will then be able to check the console using: right-click > inspect > console, and 
// should, if all is still working properly, see a JSON response with data message stating that
// I need to log in and try again, and status of 401.

// NOTE: Everything still worked properly. Originally, I believed that using this required the 
// user to have the secret, but I see that it isn't working that way. In any case, if it were then
// it would need to be deleted from the code because the user would never have the secret. I am 
// going to leave it here this way for now because it doesn't seem to harm anything.


// Register Routes:

// When a user goes to a route, the router object from each corresponding router.js file is used to
// define the actual function that is called for all of our created possible routes, where are created
// here, and inside of each of the router.js files.

app.use('/api/user', userRouter);
app.use('/api/bug', bugRouter);
app.use('/api/comment', commentRouter);

// Serve Static ReactJS Build Folder for Heroku Deployment:

// Below, we create a static folder containing our ReactJS server build, which
// will be served to the browser in a workable version.. To create this file you 
// just open a terminal, navigate into the /app directory of the ReactJS server
// you wish to use, and run the command: npm run build. On line 49, we say that
// for /*, or all routes, or when a web user arrives at our URL, they will at first
// receive the index.html file which is located in the ReactJS folder. This file
// then contains deeper links which employ the routes we created on lines 40-42.

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('/', (req, res, next) => {
//   debugMain('Home Page');
//   res.type("text/plain").send('Home Page');
// });

// Register Error Handlers:

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

// Listen for Requests:

const hostname = config.get('http.host');
const port = config.get('http.port');
app.listen(port, () => {
  console.log('\n')
  debugMain(`Server running at http://${hostname}:${port}`);
  console.log('\n');
});