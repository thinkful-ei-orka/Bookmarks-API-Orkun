const express = require('express');
const bookmarksRouter = express.Router();
const { v4: uuid } = require('uuid');

const store = require('./store')
const logger = require('./logger');
const bodyParser = express.json()


bookmarksRouter
    .route('/')
    .get((req, res) => {
        res.json(store)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, desc } = req.body;
        if (!title) {
            return res
                .status(400)
                .send('title required')
        }
        if (!url) {
            return res
                .status(400)
                .send('url required')
        }
        if (!rating) {
            return res
                .status(400)
                .send('rating required')
        }
        if (!desc) {
            return res
                .status(400)
                .send('description required')
        }
        let id = uuid();
        const newBookmark = {
            id,
            title,
            url,
            rating,
            desc
        };

        store.push(newBookmark)

        res
            .status(201)
            .location(`http://localhost:808/addresses/${id}`)
            .send('Bookmark added successfully!')
    })

bookmarksRouter
    .route('/:id') //to get a single item by it's id 
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = store.find(b => b.id == id)

        if (!bookmark) {
            logger.error(`Bookmark with id${id}`)
            return res
                .status(404)
                .send('Bookmark not found')
        }
        res.json(bookmark)
    })
    .delete((req, res) => {
        const { id } = req.params;
        const index = store.findIndex(item => item.id == id)

        if (index === -1) {
            return res
                .status(404)
                .send('User not found')
        }
        store.splice(index, 1)
        res.send(`Deleted ${id}`)

        res 
        .status(204)
        .end();
    })
       


module.exports = bookmarksRouter