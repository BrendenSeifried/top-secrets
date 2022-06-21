const { Router } = require('express');
const Redact = require('../models/Redact');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const data = await Redact.getAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
});
