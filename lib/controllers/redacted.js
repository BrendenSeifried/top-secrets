const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Redact = require('../models/Redact');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const data = await Redact.getAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
});
