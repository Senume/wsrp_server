import SongDetails from './SongDetails.js'
import PlaylistDetails from './PlaylistDetails.js'
import UserDetails from './UserDetails.js';
import MediaDetails from './MediaDetails.js';

/* Database class importing all functionalities */
class Database {
  constructor(uri, dbname) {
    // super(uri);
    this.SongsDB = new SongDetails(uri, dbname);
    this.PlaylistDB = new PlaylistDetails(uri, dbname);
    this.UsersDB = new UserDetails(uri, dbname);
    this.MediaBD = new MediaDetails(uri, dbname);
  }
}

// module.exports = Database;
export default Database;


