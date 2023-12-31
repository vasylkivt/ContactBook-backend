const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { HttpError } = require('../utils');
const User = require('../models/user');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { password, email, name } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      email,
      name,
      password: hashPassword,
    });

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
      user: { name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new HttpError({ message: 'Email in use', status: 409 }));
    } else {
      next(new HttpError({ message: error.message, status: 400 }));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpError({
        message: 'Email or password invalid',
        status: 401,
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw new HttpError({
        message: 'Email or password invalid',
        status: 401,
      });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const subscription = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({ subscription });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  const { email, name } = req.user;
  res.json({
    user: {
      name,
      email,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204).json({ message: 'Logout success' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  current,
  logout,
  subscription,
};
