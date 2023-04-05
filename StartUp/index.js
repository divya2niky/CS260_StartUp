const express = require('express');
const app = express();
app.use(express.json());
const { MongoClient } = require('mongodb');

const cookieParser= require('cookie-parser');
app.use(cookieParser());

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

// getMe for the currently authenticated user
app.get('/user/me', async (req, res) => {
  authToken = req.cookies['token'];
  const user = await collection.findOne({ token: authToken });
  if (user) {
    res.send({ email: user.email });
    return;
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
// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});


function setAuthCookie(res, authToken) {
  res.cookie('token', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

//Running the server

const port = 8080;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});