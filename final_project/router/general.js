const axios = require('axios');

const executeTasks = async () => {
    // Task 10: Get the list of all books
    try {
        const responseAllBooks = await axios.get('http://localhost:3000/books');
        console.log(responseAllBooks.data);
    } catch (error) {
        console.error(error);
    }

    // Task 11: Get the details of a specific book based on ISBN
    const isbn = '1';
    try {
        const responseBookByISBN = await axios.get(`http://localhost:3000/book/${isbn}`);
        console.log(responseBookByISBN.data);
    } catch (error) {
        console.error(error);
    }

    // Task 12: Get the details of books based on Author
    const author = 'Chinua Achebe';
    try {
        const responseBookByAuthor = await axios.get(`http://localhost:3000/booksbyauthor/${author}`);
        console.log(responseBookByAuthor.data);
    } catch (error) {
        console.error(error);
    }

    // Task 13: Get the details of books based on Title
    const title = 'Things Fall Apart';
    try {
        const responseBookByTitle = await axios.get(`http://localhost:3000/booksbytitle/${title}`);
        console.log(responseBookByTitle.data);
    } catch (error) {
        console.error(error);
    }
};

executeTasks();
