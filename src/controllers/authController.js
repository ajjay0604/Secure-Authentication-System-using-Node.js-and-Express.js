const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'NEW USER CREATED', token });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'INVALID CREDENTIALS' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'INVALID CREDENTIALS' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'USER LOGGED IN', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
