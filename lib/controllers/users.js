const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});
