const { Router } = require('express');

module.exports = Router().get('/me', async (req, res) => {
  res.json(req.user);
});
