require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken =require('./validateBearerToken')

const app = express();

const bookmarksRouter = require('./bookmarks')

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(cors());
app.use(helmet());


// BearerToken handler goes here
app.use(validateBearerToken)

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