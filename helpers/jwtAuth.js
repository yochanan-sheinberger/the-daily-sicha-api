const expressJwt = require('express-jwt');
const fs = require('fs');
const path = require('path');
// const RSA_PRIVATE_KEY = fs.readFileSync(`${process.env.PWD}../jwtRS256.key`, () => { });
const RSA_PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, '../jwtRS256.key'), () => { });

const checkIfAuthenticated = expressJwt({
  secret: RSA_PRIVATE_KEY,
  algorithms: ['RS256'],
});

module.exports = checkIfAuthenticated;