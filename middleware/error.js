const winston = require("winston");

module.exports = function(err, req, res, next) {
  // Log the exception

  if (err.request) {
    winston.error(err.message);
  } else {
    winston.error(err.message, err);
  }

  res.status(500).send("Something faild");
};
