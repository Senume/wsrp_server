import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import ffmpeg  from 'fluent-ffmpeg';
import util from 'util';

// Convertion functions 

// encapsulates the readFile as promise object 
const readFileAsync = util.promisify(fs.readFile);

async function convertWavToBase64(webmFilePath, wavFilePath) {
  // Convert WAV to Base64
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(webmFilePath)
      .audioCodec('pcm_s16le') // Set audio codec to pcm_s16le for WAV
      .audioBitrate(16)        // Set audio bitrate to 16 bits
      .on('end', resolve)
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(wavFilePath);
  });

  // Read the converted WAV file asynchronously
  const wavData = await readFileAsync(wavFilePath);

  // Convert the binary data to a Base64 string
  const base64String = wavData.toString('base64');
  return base64String;
}


// Custom class
import Database from "./utils/CollectionsFunctionality/DatabaseClass.js";
import Recognition from "./utils/RecognitionClass.js";

// Confiuration of the Server
const app = express();
const port = 3500;

// Database Server location and name
const url = 'mongodb://localhost:27017';
const dbName = 'Testing';

const DatabaseObject = new Database(url, dbName);
const RecognitionObject = new Recognition();

// Set up multer to handle the binary data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'temp/data');
  },
  filename: function (req, file, cb) {
      // Generate a unique filename here
      const fileName = file.fieldname + '-' + Date.now();
      // Attach the file name to the request object
      req.fileName = fileName;
      const fileNameext = fileName + path.extname(file.originalname);
      cb(null, fileNameext);
  }
});

//const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());


// To -Do 
// 1. Data structure verification
// 2. Adding song to database
// web token


// Handle registeration events
app.post('/register', async (req, res) => {
  const userData = req.body;
  userData.Password = await bcrypt.hash(userData.Password, 10);
  await DatabaseObject.UsersDB.UpdateUser(userData);
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

// Returns song details based on ID
app.get('/songdetails/:songid', async (req, res) => {

  const SongID = req.params.songid;
  console.log("ID", SongID);
  const SongDetails = await DatabaseObject.SongsDB.FindaDocument(Number(SongID));
  console.log("Here", SongDetails)
  if (SongDetails) res.status(200).json(SongDetails); else res.status(404).send('No such song exists');

})

// Return Playlist information based ID
app.get('/playlistdetails/:playlistid', async (req, res) => {
  const PlaylistID = req.params.playlistid
  const PlaylistDetails = await DatabaseObject.PlaylistDB.FindaPlaylist(Number(PlaylistID));
  if(PlaylistDetails) res.status(200).send(PlaylistDetails); else res.status(404).send('Playlist not available');

})

// Retrives information on playlist based on its user ID
app.get('/playlistdetails/User/:userid', async (req,res) => {

  const UserID = req.params.userid
  const PlaylistDetails = await DatabaseObject.PlaylistDB.FindaUserPlaylist(UserID);
  if(PlaylistDetails.length !== 0) res.status(200).send(PlaylistDetails); else res.status(404).send('Playlist not available');

})

// Updates users state on the database
app.post('/userupdate', async (req,res) => {

  const userData = req.body;
  await DatabaseObject.UsersDB.UpdateUser(userData);

})

app.post('/addsongdetails', async (req,res) => {

  const songData = req.body;
  console.log(songData);
  const Result = DatabaseObject.SongsDB.UpdateSongDetails(songData);
  if (Result) res.status(200).json({success: 1}); else res.status(404).json({success: 0});

})

app.post('/recognisesong', upload.single('audio') , async (req, res) => {

  // Uploaded Temporary Audio File
  const Fileweb = process.cwd() + "/temp/data/" + req.fileName + '.webm';
  const Filemp3 = process.cwd() + "/temp/data/" + req.fileName + '.wav';

  // Converting the encoding to from webm to s_pcm16_le (wav) format
  const string64 = await convertWavToBase64(Fileweb, Filemp3);
  // Recognition details of the audio data.
  const Result = await RecognitionObject.ProcessRecognition(string64);

  // Delelting the Temporary Files
  await fs.unlink(Filemp3, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File is deleted.');
    }
  });

  await fs.unlink(Fileweb, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File is deleted.');
    }
  });

  // Reponse of the API call with the song details
  console.log(Result)
  res.status(200).json(Result.track);

});

app.post('/detaillist', async (req, res) => {
  const list = req.body.listid;
  try {
    const Result = await DatabaseObject.SongsDB.FindingallSongs(list);
    if (Result) res.status(200).json(Result); else res.status(404).send("Error at Server side.");
  } catch (error) {
    console.log("Errror at 'detaillist' enpoint: ", error.message);
  }
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


