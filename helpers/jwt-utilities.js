const fs   = require('fs');
const jwt   = require('jsonwebtoken');

const privateKEY  = fs.readFileSync('./rsa-keys/key', 'utf8');
const publicKEY  = fs.readFileSync('./rsa-keys/key.pub', 'utf8');

module.exports = {
  sign: (payload, opts) => {
    const signOptions = {
      expiresIn:  '30d',
      algorithm:  'RS256',
      ...opts         
    };
    const secret = {
      key: privateKEY,
      passphrase: process.env.KEY_PWD
    };
    return jwt.sign(payload, secret, signOptions);
  },
  verify: (token, opts) => {
    const verifyOptions = {
        expiresIn:  "30d",
        algorithms:  ["RS256"],
        ...opts
    };
    return jwt.verify(token, publicKEY, verifyOptions);
  }
}