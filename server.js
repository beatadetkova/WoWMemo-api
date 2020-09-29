const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const dotenv = require('dotenv');
const decode = require('./helpers/jwt-utilities.js');
const verify = require('./helpers/jwt-utilities.js');

let db;

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
  db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
    },
  });
} else {
  db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
}

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const app = express();

app.use(express.json());
app.use(cors());

// START testing JWT
// app.get('/', (req, res) => {
//   const payload = {
//     name: 'Bea',
//     age: 29,
//     nerd: true
//   }
//   const jwt = require('./helpers/jwt-utilities.js').sign(payload)
//   res.send(jwt)
// })
app.post('/verify', (req, res) => {
  const { jwt } = req.body;
  try {
    const verified = verify.verify(jwt);
    res.json(JSON.stringify(verified));
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized!');
  }
});

app.post('/decode', (req, res) => {
  const { jwt } = req.body;
  const decoded = decode.decode(jwt);
  console.log(decoded.payload);
  res.json(JSON.stringify(decoded));
});

// END testing JWT

app.post('/auth/signin', signin.handleSignin(db, bcrypt));
app.post('/auth/register', register.handleRegister(db, bcrypt));

app.listen(process.env.PORT || 4000, () => {
  console.log(`app is running on port ${process.env.PORT || 4000}`);
});
