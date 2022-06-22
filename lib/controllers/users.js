const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sesToken = await UserService.signIn({ email, password });
      res
        .cookie(process.env.COOKIE_NAME, sesToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Welcome you are signed in!' });
    } catch (e) {
      next(e);
    }
  })

  .get('/me', authenticate, async (req, res) => {
    res.json(req.user);
  });
