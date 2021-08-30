const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const flights = require('./routes/api/flights');

const app = express();

//Body parser config
app.use(express.urlencoded());
app.use(express.json());

// Db config
const db = keys.mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected'))
  .catch((err) => console.log(err));

//passport config
app.use(passport.initialize());
require('./config/passport')(passport);  

// First route
app.get('/', (req, res) => res.send('Hello World!'));

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
// app.use('/api/flights', flights);


const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));