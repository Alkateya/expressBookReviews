const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bcrypt = require('bcryptjs');
const regd_users = express.Router();

let users = [];

const saltRounds = 10;

// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Check if username and password match the one we have in records.
const authenticatedUser = async (username,password) => {
  const user = users.find(user => user.username === username);
  if(user){
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  }
  return false;
}

// Register a new user
regd_users.post("/register", async (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and Password are required"});
  }

  const isValidUser = isValid(username);
  if(isValidUser){
    return res.status(409).json({message: "Username already exists"});
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  users.push({username, password: hashedPassword});
  
  return res.status(200).json({message: "User Registered Successfully"});
});

//only registered users can login
//only registered users can login
regd_users.post("/login", async (req,res) => {
  const {username, password} = req.body;

  const isValidUser = isValid(username);
  if(!isValidUser){
    return res.status(401).json({message: "Invalid Username"});
  }

  const isAuthenticated = await authenticatedUser(username, password);
  if(!isAuthenticated){
    return res.status(401).json({message: "Invalid Password"});
  }
  
  const token = jwt.sign({username}, process.env.JWT_SECRET || "default-secret", { expiresIn: '1h' });
  res.status(200).json({ token, message: "User Logged In Successfully"});
});


// Add a book review
// Add a book review
regd_users.put("auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.username; // assuming username is stored in session

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews[user]) { // if user has not reviewed this book yet
    books[isbn].reviews[user] = review; // add new review
  } else { // if user has already reviewed this book
    books[isbn].reviews[user] = review; // modify existing review
  }

  res.status(200).json({message: "Review added/modified successfully", book: books[isbn]});
});

regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  const username = req.username; // assumindo que você armazenou o nome de usuário na solicitação após a autenticação
  const userReviewIndex = book.reviews.findIndex(review => review.username === username);

  if (userReviewIndex === -1) {
    return res.status(404).json({message: "User review not found"});
  }

  book.reviews.splice(userReviewIndex, 1);
  return res.status(200).json({message: "Review deleted successfully"});
});




module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
