const bcrypt = require("bcrypt");

const isPassword = async (password, hashPass) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashPass, function (err, result) {
      if (err) {
        return reject(err); // ❌ If error, reject the promise
      }
      resolve(result); // ✅ Resolve with true or false
    });
  });
};

module.exports = isPassword;
