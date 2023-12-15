import hashIt from "hash-it";               // Library to handle Hash functionalities

/**
 * @constructor Create a new instance of Playlist to hold the specified song list to a user.
 * @param {string} Name Name of the playlist
 * @param {number} UserId User to which this playlist belongs.
 */
export default class Playlist {

    constructor(playlistName, userId, dbName, URI) {
        this.Name = playlistName;
        this.UserId = userId;
        this.SongList = [];
        this.ID = null;

        this.URI = URI;
        this.DBName = dbName;
        this.BucketName = "SongDetails";
        this.Client = new MongoClient(this.URI, { maxConnecting: 10});
    }

    /**
     * Function to generate a unique ID for this playlist based on the playlist details.
     * @returns {number} Returns the ID of the playlist
     */
    GenerateHashID() {
        const TempID =  hashIt((this.Name + this.UserId).toUpperCase());   // Hashing Song details based on the Song Details
        this.ID = TempID;                                                                               // Updating the Unique ID.
        return this.ID;                                                                                 // Logging purpose.
    }

    /**
     * Functionality to Add songs to the list of songs.
     * @param {number} SongID  Unique ID of the song which is being added to playlist.
     * @returns Returns a boolean value indicating success or failure of operation.
     */
    AddSong(SongID) {
        this.SongList.push(SongID);
        return 1;
    }

    /**
     * Functionality to remove a specified song from the playlist.
     * @param {number} SongID Unique ID of the song which needs to be filter out.
     */
    DeleteSong(SongID) {
        const Index = this.SongList.findIndex((element) => element === SongID);
        if (Index !== -1) {
            this.SongList.splice(Index, 1);
            return 1
        } else {
            throw new Error('Song not in Playlist');
        }  
    }

    /**
     * Retrives the playlist information.
     * @returns {object} returns details of the playlist, which includes playlist ID, songname, author, songlist
     */
    GetSongList() {
        return {
                    ID: this.ID,
                    Name: this.Name,
                    UserId: this.UserId,
                    SongList: this.SongList
                }
    }


    async UpdatePlaylist(Data){
        try {
            console.log(Data)
            // Connecting to MongoDB server
            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);

            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            const Result = await Collection.updateOne({'ID': {$eq: Data.ID}},{$set: Data}, {upsert: true});
            console.log("Successful operation: ", Result);

            // Closing the connection
            this.Client.close();
            console.log("Closed connection");
            return 1;

        } catch (error) {
            console.log(error.message);
            throw new Error("Document adding operation failed");
        }

    }


}