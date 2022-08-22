module.exports = async (req, res, next) => {
  try {
    if (!req.user || req.user.email !== 'admin')
      throw new Error('You are not authorized to view this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
