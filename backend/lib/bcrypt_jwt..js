const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// const hashPassword = async (myPlaintextPassword) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log(hashedPassword);
//     return hashedPassword;
//   } catch (err) {
//     throw err;
//   }
// };

// module.exports = hashPassword;

const emailJwtSign = (email) => {
  const payload = { email };
  const secret = process.env.JWT_SECRET || "shhhhh";
  const options = { expiresIn: "7d" };

  return jwt.sign(payload, secret, options);
};

module.exports = emailJwtSign;
