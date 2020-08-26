const handleRegister = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password ) {
    return res. status(400).json('incorrect form submission');
  }
  const hash = await bcrypt.hash(password, 10);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email,
      joined: new Date()
    })
    .into('users')
    .returning('email')
    .then(email => res.send(email))
    .catch(err => res.status(400).json('unable to register'))
  })
}

module.exports = {
  handleRegister: handleRegister
};
