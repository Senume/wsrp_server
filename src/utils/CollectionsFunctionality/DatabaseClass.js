import SongDetails from './SongDetails.js'
import PlaylistDetails from './PlaylistDetails.js'
import UserDetails from './UserDetails.js';

/* Database class importing all functionalities */
class Database {
  constructor(uri, dbname) {
    // super(uri);
    this.SongsDB = new SongDetails(uri, dbname);
    this.PlaylistDB = new PlaylistDetails(uri, dbname);
    this.UsersDB = new UserDetails(uri, dbname);
  }
}

// module.exports = Database;
export default Database;


