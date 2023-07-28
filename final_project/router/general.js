const express = require('express');
const public_users = express.Router();
const books = require('./booksdb.js');

public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn]));
    } else {
        res.status(404).send(`Book with ISBN: ${isbn} not found.`);
    }
});

public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksByAuthor = [];
    for (let isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    }
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor));
    } else {
        res.status(404).send(`No books found by author: ${author}.`);
    }
});

public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksByTitle = [];
    for (let isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    }
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle));
    } else {
        res.status(404).send(`No books found with title: ${title}.`);
    }
});

public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    if (books[isbn]) {
        let reviews = books[isbn].reviews;
        if (Object.keys(reviews).length > 0) {
            res.send(JSON.stringify(reviews));
        } else {
            res.status(404).send(`No reviews found for book with ISBN: ${isbn}.`);
        }
    } else {
        res.status(404).send(`Book with ISBN: ${isbn} not found.`);
    }
});

module.exports = public_users;
