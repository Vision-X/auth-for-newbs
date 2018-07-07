const express = require('express');
const volleyball = require('volleyball');
// const bodyParser = require('body-parser');

const app = express();

const auth = require('./auth/index.js');

app.use(volleyball);

// REMINDER!! Explain this. And look into the built in body parser instead
// app.use(bodyParser.json());

// Express now comes with body-parser as of v16.3, no need to bring it in

app.use(express.json());

// ant route in here is pre-pended with /auth
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨Hello World! 🌈✨🦄'
  });
});

// use the auth file anytime a request comes in with /auth
app.use('/auth', auth);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
