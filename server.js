const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
let db
if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
  db = knex({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PWD,
      database : process.env.DB_NAME
    }
  });
} else {
  db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
}

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const app = express();

app.use(express.json());
app.use(cors())

// START testing JWT
app.get('/', (req, res) => {
  const payload = {
    name: 'Bea',
    age: 29,
    nerd: true
  }
  const jwt = require('./helpers/jwt-utilities.js').sign(payload)
  res.send(jwt)
})
app.post('/verify', (req, res) => {
  const { jwt } = req.body
  try {
    const verify = require('./helpers/jwt-utilities.js').verify(jwt)
    res.json(JSON.stringify(verify))
  } catch (err) {
    console.log(err)
    res.status(401).send('Unauthorized!')
  }  
})
// END testing JWT

app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))

app.listen(process.env.PORT || 4000, ()=> {
  console.log(`app is running on port ${process.env.PORT || 4000}`)
})
