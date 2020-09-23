const { sign } = require('../helpers/jwt-utilities.js');

const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  return db
    .select('email', 'hash')
    .from('users')
    .where('email', '=', email)
    .then(async (data) => {
      console.log(data);
      const isValid = await bcrypt.compare(password, data[0].hash);
      if (isValid) {
        const payload = { email };
        const jwt = sign(payload);
        res.json(JSON.stringify({ jwt }));
      } else {
        res.status(401).json('unauthorized access');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json('user not found');
    });
};

module.exports = {
  handleSignin,
};
