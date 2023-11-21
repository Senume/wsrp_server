import Database from "./DatabaseClass.js";

const DataBase = new Database("mongodb://0.0.0.0:27017", "Songs");

await DataBase.UsersDB.AddUser({
  name: "Viswes",
  age: 16,
});

console.log(await DataBase.UsersDB.Finduser("Viswes"));

await DataBase.UsersDB.UpdateUser("Viswes", { age: 18, gender: "male" });

await DataBase.PlaylistDB.MakePlaylist({
  name: "Liked Songs",
  songs: ["The Nights", "The Oldies", "The newons"],
});

await DataBase.PlaylistDB.UpdatePlaylist(
  "Liked Songs",
  "Viswes",
  ["The Nights", "The Oldies"],
  "remove"
);

console.log(DataBase.PlaylistDB.FindPlaylist("The Nights"));

await DataBase.HistoryDB.UpdateHistory("Viswes", ["The T", "The U", "The V"]);

await DataBase.SongsDB.uploadMP3File(
  "C:/Users/Visweswaran/Downloads/Nights.mp3",
  {
    filename: "Nights.mp3",
    title: "The Nights",
    artist: "Avici",
  }
);

await DataBase.SongsDB.downloadMP3File(
  "The Nights",
  "C:/Users/Visweswaran/Downloads/FromNights.mp3"
);
