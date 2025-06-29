const jwt = require("jsonwebtoken");

const isSignin = (req, res, next) => {
  try {
    const token = req.signedCookies?.token || req.cookies?.token;
    console.log(token);
    // If no token, proceed to next route (user is not logged in)
    if (!token) {
      return next();
    }

    // If token exists, try to decode it
    const decoded = jwt.verify(token, "shhhhh");

    if (decoded) {
      // User is already signed in
      return res.status(400).json({ message: "User is already signed in" });
    }

    next(); // Proceed only if no valid token
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isSignin;
