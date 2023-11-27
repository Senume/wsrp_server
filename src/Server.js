import express from "express";
import bcrypt from "bcrypt";

import Database from "./utils/CollectionsFunctionality/DatabaseClass.js";

// Confiuration of the Server
const app = express();
const port = 3500;

// Database Server location and name
const url = 'mongodb://localhost:27017';
const dbName = 'Testing';

const DatabaseObject = new Database(url, dbName);

app.use(express.json());

// Handle registeration events
app.post('/register', async (req, res) => {
  const userData = req.body;
  userData.Password = await bcrypt.hash(userData.Password, 10);
  DatabaseObject.UsersDB.UpdateUser(userData);
  res.status(200).send("Received data");
})

// Handle login request
app.post('/login', async (req, res) => {

  const userData = req.body;
  console.log(userData);
  const ExistingUserData = await DatabaseObject.UsersDB.FindUser(userData.UserName);
  if(ExistingUserData){
    const Result = await bcrypt.compare(userData.Password, ExistingUserData.Password)
    delete ExistingUserData.Password
    if (Result) return res.status(200).send(ExistingUserData); else res.status(400).send('Invalid password');
  }
  else res.status(403).send("Invalid username or password")
})

// Handle song details based on ID
app.get('/songdetails/:songid', (req, res) => {})

// Return Playlist information based ID
app.get('/playlistdetails/:playlistid', (req, res) => {})

// Gets information of a playlist based on its user ID
app.get('/playlistdetails/User/:userid', (req,res) => {})

// Updates users state on the database
app.post('/userupdate', (req,res) => {})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
