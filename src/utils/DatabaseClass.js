import History from "./Collections/History.js";
import Songs from "./Collections/Songs.js";
import Playlist from "./Collections/Playlist.js";
import Users from "./Collections/Users.js";

/* Database class importing all functionalities */
class Database {
  constructor(uri, dbname) {
    // super(uri);
    this.HistoryDB = new History(uri, dbname);
    this.SongsDB = new Songs(uri, dbname);
    this.PlaylistDB = new Playlist(uri, dbname);
    this.UsersDB = new Users(uri, dbname);
  }
}

export default Database;

// Example usage in Trial.js
