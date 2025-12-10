const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserAccount = require('../models/useraccounts');
const bcrypt = require('bcrypt'); 

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
}

// new
router.get('/new', (req, res) => {
  res.render('new', { formData: {}, errors: {} });
});

// CREATE
router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    res.redirect('/users');
  } catch (err) {
    console.log(err);
    res.render('new', { formData: req.body, errors: err.errors });

  }
});

// READ ALL
router.get('/',requireLogin, async (req, res) => {
  const users = await User.find();
  res.render('users', { users });
});



// user registration
router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAccount({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserAccount.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      res.redirect('/users');
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});   

// READ ONE
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// UPDATE
router.put('/:id', async (req, res) => {
    console.log(req.body);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});   

// user registration
module.exports = router;