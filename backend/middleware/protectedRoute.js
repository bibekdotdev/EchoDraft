const jwt = require("jsonwebtoken");

const protectedRoute = (req, res, next) => {
  try {
    const token = req.signedCookies?.token || req.cookies?.token;
    console.log("Token:", token);

    if (!token) {
      return res.status(400).json({ message: "Signin first" });
    }

    const decoded = jwt.verify(token, "shhhhh");

    if (!decoded) {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    console.log(decoded.email);
    req.user = decoded.email;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protectedRoute;
