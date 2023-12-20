import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs, { rmSync } from "fs";
import cors from "cors";
import ffmpeg from "fluent-ffmpeg";
import util from "util";
import session from "express-session";
import cookieParser from "cookie-parser";
import { MongoClient, GridFSBucket } from "mongodb";

// Convertion functions

// encapsulates the readFile as promise object
const readFileAsync = util.promisify(fs.readFile);

async function convertWavToBase64(webmFilePath, wavFilePath) {
    // Convert WAV to Base64
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(webmFilePath)
            .audioCodec("pcm_s16le") // Set audio codec to pcm_s16le for WAV
            .audioBitrate(16) // Set audio bitrate to 16 bits
            .on("end", resolve)
            .on("error", (err) => {
                console.error("Error:", err);
                reject(err);
            })
            .save(wavFilePath);
    });

    // Read the converted WAV file asynchronously
    const wavData = await readFileAsync(wavFilePath);

    // Convert the binary data to a Base64 string
    const base64String = wavData.toString("base64");
    return base64String;
}

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(403).send("Unauthorized access");
    }
};

// Custom class
import Database from "./utils/CollectionsFunctionality/DatabaseClass.js";
import Recognition from "./utils/RecognitionClass.js";

// Confiuration of the Server
const app = express();
const port = 3500;

// Database Server location and name
const url = "mongodb://localhost:27017";
const dbName = "Testing";

const DatabaseObject = new Database(url, dbName);
const RecognitionObject = new Recognition();

// Set up multer to handle the binary data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "temp/data");
    },
    filename: function (req, file, cb) {
        // Generate a unique filename here
        const fileName = file.fieldname + "-" + Date.now();
        // Attach the file name to the request object
        req.fileName = fileName;
        const fileNameext = fileName + path.extname(file.originalname);
        cb(null, fileNameext);
    },
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "temp/uploads");
    },
    filename: function (req, file, cb) {
        // Generate a unique filename here
        const fileName = req.params.fileID + ".mp3";

        // Attach the file name to the request object
        cb(null, fileName);
    },
});

//const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "AIE03",
    })
);

// To -Do
// 1. Data structure verification
// 2. Adding song to database
// web token

// User Database Operation
// Handle registeration events
app.post("/register", async (req, res) => {
    const userData = req.body;
    userData.Password = await bcrypt.hash(userData.Password, 10);
    await DatabaseObject.UsersDB.UpdateUser(userData);
    res.status(200).send("Received data");
});

app.post("/signup", async (req, res) => {
    const userData = req.body;
    // userData.password = await bcrypt.hash(userData.password, 10);
    // console.log(userData);
    DatabaseObject.UsersDB.AddUser(userData);
    res.status(200).send("Added User");
});

app.post("/finduser", async (req, res) => {
    const userData = req.body;
    const ExistingUserData = await DatabaseObject.UsersDB.FindUser(
        userData.UserName
    );
    if (ExistingUserData) {
        res.status(200).send(ExistingUserData);
    }
    res.status(400);
});

// Handle login request
app.post("/login", async (req, res) => {
    const userData = req.body;
    const ExistingUserData = await DatabaseObject.UsersDB.FindUser(
        userData.UserName
    );
    if (ExistingUserData) {
        // const Result = await bcrypt.compare(
        //   userData.Password,
        //   ExistingUserData.Password
        // );
        const Result = userData.password === ExistingUserData.password;
        delete ExistingUserData.password;
        if (Result) {
            // Set the user in the session
            req.session.user = ExistingUserData;
            return res.status(200).send(ExistingUserData);
        } else res.status(400).send("Invalid password");
    } else res.status(403).send("Invalid UserName or password");
});

app.post("/logout", async (req, res) => {
    const Result = DatabaseObject.UsersDB.UpdateUser(req.body);
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
    });
    res.status(200).send("logged out");
});

// Updates users state on the database
app.post("/userupdate", async (req, res) => {
    const userData = req.body;
    await DatabaseObject.UsersDB.UpdateUserProfile(userData);
    res.status(200).send("UpdatedUser");
});

app.get("/alluser", async (req, res) => {
    const Data = await DatabaseObject.UsersDB.FindAllUserDatabase();
    if (Data) res.status(200).send(Data);
    else res.status(404).send({ success: 0 });
});

app.post("/updateuserrights", async (req, res) => {
    const Data = req.body;
    console.log(Data);
    const result = await DatabaseObject.UsersDB.UpdateUserRights(Data);
    if (result) res.status(200).send({ success: 0 });
    else res.status(404).send({ success: 0 });
});

// Song Databse Operations
// Returns song details based on ID
app.get("/songdetails/:songid", async (req, res) => {
    const SongID = req.params.songid;
    console.log("ID", SongID);
    const SongDetails = await DatabaseObject.SongsDB.FindaDocument(
        Number(SongID)
    );
    console.log("Here", SongDetails);
    if (SongDetails) res.status(200).json(SongDetails);
    else res.status(404).send("No such song exists");
});

// Adds a new song details to the database
app.post("/addsongdetails", async (req, res) => {
    const songData = req.body;
    console.log(songData);
    const Result = DatabaseObject.SongsDB.UpdateSongDetails(songData);
    if (Result) res.status(200).json({ success: 1 });
    else res.status(404).json({ success: 0 });
});

// API request to request the song details from third party.
app.post("/recognisesong", upload.single("audio"), async (req, res) => {
    // Uploaded Temporary Audio File
    const Fileweb = process.cwd() + "/temp/data/" + req.fileName + ".webm";
    const Filemp3 = process.cwd() + "/temp/data/" + req.fileName + ".wav";

    // Converting the encoding to from webm to s_pcm16_le (wav) format
    const string64 = await convertWavToBase64(Fileweb, Filemp3);
    // Recognition details of the audio data.
    const Result = await RecognitionObject.ProcessRecognition(string64);

    // Delelting the Temporary Files
    await fs.unlink(Filemp3, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("File is deleted.");
        }
    });

    await fs.unlink(Fileweb, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("File is deleted.");
        }
    });

    // Reponse of the API call with the song details
    console.log(Result);
    res.status(200).json(Result.track);
});

// Retives song details as a list from list of song ids.
app.post("/detaillist", async (req, res) => {
    const list = req.body.listid;
    console.log("List of Song ID Data required: ", list);
    try {
        const Result = await DatabaseObject.SongsDB.FindingallSongs(list);
        // console.log("Result of fetched Data for song ID: ",Result)
        if (Result) res.status(200).json(Result);
        else res.status(404).send("Error at Server side.");
    } catch (error) {
        console.log("Errror at 'detaillist' enpoint: ", error.message);
    }
});

app.get("/allsongs", async (req, res) => {
    const Data = await DatabaseObject.SongsDB.FindAllSongsDatabase();
    if (Data) res.status(200).send(Data);
    else res.status(404).send({ success: 0 });
});

// Playlist Databse Operations
// Return Playlist information based ID
app.get("/playlistdetails/:playlistid", async (req, res) => {
    const PlaylistID = req.params.playlistid;
    const PlaylistDetails = await DatabaseObject.PlaylistDB.FindaPlaylist(
        Number(PlaylistID)
    );
    if (PlaylistDetails) res.status(200).send(PlaylistDetails);
    else res.status(404).send("Playlist not available");
});

// Retrives information on playlist based on its user ID
app.get("/playlistdetails/User/:userid", async (req, res) => {
    const UserID = req.params.userid;
    const PlaylistDetails = await DatabaseObject.PlaylistDB.FindaUserPlaylist(
        UserID
    );
    if (PlaylistDetails.length !== 0) res.status(200).send(PlaylistDetails);
    else res.status(404).send("Playlist not available");
});

// adding an playlist into database
app.post("/addplaylist", async (req, res) => {
    const list = req.body.playlist;
    try {
        const Result = await DatabaseObject.PlaylistDB.UpdatePlaylist(list);
        if (Result) res.status(200).json(Result);
        else res.status(404).send("Error at Server side.");
    } catch (error) {
        console.log("Errror at 'detaillist' enpoint: ", error.message);
    }
});

// Retriving the array of playlist from database.
app.post("/retrieve/playlist", async (req, res) => {
    const list = req.body.listid;
    console.log(list);
    console.log(typeof list);

    try {
        const Result = await DatabaseObject.PlaylistDB.FindallPlaylist(list);
        if (Result) res.status(200).json(Result);
        else res.status(404).send("Error at Server side.");
    } catch (error) {
        console.log("Errror at '/retrieve/playlist' enpoint: ", error.message);
    }
});

// Media Databse Operations
// Upload a audio file.
app.post(
    "/upload-audio/:fileID",
    upload1.single("audioFile"),
    async (req, res) => {
        try {
            console.log("File uploaded with unique code:", req.params.fileID);
            DatabaseObject.MediaBD.uploadMP3File(
                process.cwd() + "/temp/uploads/" + req.params.fileID + ".mp3",
                req.params.fileID
            );
            res.status(200).send("Audio file uploaded successfully.");

            // // Delelting the Temporary Files
            // fs.unlink(process.cwd() + "/temp/uploads/" + req.params.fileID + ".mp3", (err) => {
            // if (err) {
            //   console.error(err);
            // } else {
            //   console.log('File is deleted.');
            // }
            // });
        } catch (error) {
            console.error("Error uploading audio file:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);

app.get("/stream/:fileID", async (req, res) => {
    const fileID = req.params.fileID;
    console.log("Streaming file " + fileID);
    const Client = new MongoClient(url, { maxConnecting: 10 });
    if (fileID !== null) {
        try {
            const database = Client.db(dbName);
            const bucket = new GridFSBucket(database, {
                bucketName: "Media",
            });

            console.log("File to stream: ", fileID);
            const readStream = bucket.openDownloadStreamByName(Number(fileID));
            readStream.pipe(res);
        } catch (error) {
            console.log("Error streaming file:", error.message);
        }
    } else res.status(404).send("File ID is NULL");
});

app.get("/allmedia", async (req, res) => {
    const Data = await DatabaseObject.MediaBD.FindAllSongsDatabase();
    if (Data) res.status(200).send(Data);
    else res.status(404).send({ success: 0 });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
