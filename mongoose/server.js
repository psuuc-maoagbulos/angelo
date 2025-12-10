const express = require('express');
const connectDB = require('./db/connection');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'mysupersecretkey',
  resave: false,
  saveUninitialized: true
}));



app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.redirect('/users/login');
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000:");
});