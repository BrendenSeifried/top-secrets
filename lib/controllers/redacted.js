const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Redact = require('../models/Redact');

module.exports = Router()
  .post('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const secret = await Redact.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Redact.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
