const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js');
const genl_routes = require('./router/general.js');
const app = express();
require('dotenv').config();


app.use(express.json());

app.use("/customer", session({
  secret: process.env.JWT_SECRET || "default-secret",
  resave: true, 
  saveUninitialized: true
}));

app.use("/customer/auth", function auth(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, process.env.JWT_SECRET || "default-secret", function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
  });
  

 
const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));



process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });
  
  process.on('unhandledRejection', function(err) {
    console.log('Caught rejection: ' + err);
  });
  
