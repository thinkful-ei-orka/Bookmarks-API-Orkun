require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const logger = require('./logger');

const app = express();

const bookmarksRouter = require('./bookmarks')

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(cors());
app.use(helmet());


// BearerToken handler goes here
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      logger.error(`Unauthorized request to path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

app.use('/bookmarks', bookmarksRouter)




function errorHandler(error, req, res, next) {
    if (NODE_ENV === 'production') {
        response = { message: 'Internal server error occured.' }
    } else {
        console.log(error);
        response = { error, message: error.message }
    }

    res.status(500).json(response);
}

app.use(errorHandler);

module.exports = app;