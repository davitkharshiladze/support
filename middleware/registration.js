module.exports = function(req, res, next) {
  // const sessionExpression = req.header("sessionExpression");
  // if (!sessionExpression) return res.status(400).send("Bad Request");
  // if (!req.user.registrationRequired)
  //   return res.status(409).send("employee already registered");
  res.send("YES");
  next();
};
