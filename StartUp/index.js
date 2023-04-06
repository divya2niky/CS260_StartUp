const express = require('express');
const cors = require('cors');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;


const corsOptions = {
    origin: 'http://127.0.0.1:5502',
    credentials: true
}

const { MongoClient } = require('mongodb');

const cookieParser= require('cookie-parser');
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);



const userName = 'divya2niky';
const password = 'divyanikitha';
const hostname = 'cluster0.dknwtlz.mongodb.net';
const uuid = require('uuid');
const path = require('path');

const uri = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(uri);
const collection = client.db('test').collection('users');
const bcrypt = require('bcrypt');

//New user create API

app.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({
      id: user._id,
    });
  }
});

// Login API 
app.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.email);
  if (user) {
  
    if (req.body.password.localeCompare(user.password)==0) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});



function getUser(email) {
  return collection.findOne({ email: email });
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await collection.insertOne(user);

  return user;
}


function setAuthCookie(res, authToken) {
  res.cookie('token', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});