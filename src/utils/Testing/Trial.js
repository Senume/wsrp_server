import Database from "./DatabaseClass.js";

const DataBase = new Database("mongodb://0.0.0.0:27017", "Songs");

// User
console.log(await DataBase.UsersDB.Finduser("Viswes"));

await DataBase.UsersDB.UpdateUser({
  username: "Viswes",
  age: 18,
  gender: "male",
});

// Playlist
await DataBase.PlaylistDB.UpdatePlaylist({
  name: "Liked Songs",
  editor: "Chubramani",
  decision: "add",
  songs: ["The Nights", "The mornings"],
});

console.log(DataBase.PlaylistDB.FindPlaylist("The Nights"));

// History
await DataBase.HistoryDB.UpdateHistory("Viswes", ["The T", "The U", "The V"]);

// Songs
import Songs from "./Collections/Songs.js"; // Assuming Songs class is in a separate file
const songs = new Songs("mongodb://0.0.0.0:27017", "Songs");

// upload file
const fileId = await songs.uploadMP3File(
  "C:/Users/Visweswaran/Downloads/Nights.mp3",
  {
    title: "TheNights",
    artist: "Viswes",
  }
);
console.log("Uploaded file ID:", fileId);
const song = new Songs("mongodb://0.0.0.0:27017", "Songs");

// streaming endpoint
song.createStreamingEndpoint();

// download
await DataBase.SongsDB.downloadMP3File(
  "TheNights",
  "C:/Users/Visweswaran/Downloads/FromNights.mp3"
);

// the streaming will be available in http://localhost:3000/stream/SongName
