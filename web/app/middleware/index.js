const jwt = require("jsonwebtoken");
const db = require("../../../database/");

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  checkAuth: async function(req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"] || req.query.bearer;
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(403).json({ error: "Token is expired" });
        }
        const user = await db.User.findById(decoded.id);
        req.user = user;
        next();
      });
    } else {
      next();
    }
  },

  ensureAuthenticated: async function(req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"] || req.query.bearer;
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(403).json({ success: false, error: "Token is invalid" });
        }
        const user = await db.User.findById(decoded.id);
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Auth token is not supplied",
      });
    }
  },
};
