const saltRounds = 10;
const bcrypt = require('bcrypt');

const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res. status(400).json('incorrect form submission');
  }
  db.select('email', 'hash').from('users')
    .where('email', '=', email)
    .then(async data => {
      console.log(data);
      const isValid = await bcrypt.compare(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
      } else {
          res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin
}
