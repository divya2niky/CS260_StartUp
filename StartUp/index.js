const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

const cookieParser= require('cookie-parser');
app.use(cookieParser());
//end of wqeb socket
const corsOptions = {
  origin: 'http://127.0.0.1:5502',
  credentials: true
}

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

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;


server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

// // Create a websocket object
// var server = require('ws').server;
// var s = new server({port: 5001});



const { WebSocketServer } = require('ws');
// Create a websocket object
const wss = new WebSocketServer({ noServer: true });

// Handle the protocol upgrade from HTTP to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

// wss.on('connection', function(ws){
//   ws.on('message',function(message){
//     console.log("Received " + message);
//     ws.send(message);
//   })
// })


 // Forward messages to everyone except the sender
 wss.on('connection', (ws) => {
   // Forward messages to everyone except the sender
  ws.on('message', function message(data) {
        console.log("Received " + data);
        ws.send(data);
      
    
  });

  
});




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
    
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      console.log("authorized");
     
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});


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


function setAuthCookie(res, authToken) {
  res.cookie('token', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Return the application's default page if the path is unknown
// app.use((_req, res) => {
//   res.sendFile('/login.html', { root: 'public' });
// });
