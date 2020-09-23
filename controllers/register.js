const { sign } = require('../helpers/jwt-utilities.js');

const handleRegister = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = await bcrypt.hash(password, 10);
  return db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
        joined: new Date(),
      })
      .into('users')
      .returning('email')
      .then((userEmails) => {
        const payload = { email: userEmails[0] };
        const jwt = sign(payload);
        res.json(JSON.stringify({ jwt }));
      })
      .then(trx.commit)
      .catch((err) => {
        console.log(err);
        trx.rollback(err);
        res.status(400).json('unable to register');
      });
  });
};

module.exports = {
  handleRegister,
};
