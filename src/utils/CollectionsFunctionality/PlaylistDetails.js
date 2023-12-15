import { MongoClient} from "mongodb";

/**
 * Class to define the abstracted functionalities of SongDetail Database operation.
 * @constructor
 * @param {string} URI The URI of the database server.
 * @param {string} dbName The name of the Database on the server.
 */
class PlayListDetails {
    constructor(URI, dbName) {
        this.URI = URI;
        this.DBName = dbName;
        this.BucketName = "PlaylistDetails";
        this.Client = new MongoClient(this.URI);
    }

    /**
     * FUnction to update or add a new playlist document.
     * @param {object} Data New playlist document.
     */
    async UpdatePlaylist(Data) {
        try {
            // Connecting to MongoDB server
            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);

            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            const Result = await Collection.updateOne({'ID': {$eq: Data.ID}}, {$set: Data}, {upsert: true});
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

    /**
     * Function to delete a playlist document from the database.
     * @param {number} Document_ID Unique ID of the document
     */
    async RemovePlaylist(Document_ID) {
        try {
            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);

            // Specifying the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Deleting a document from the collection.
            const Result = await Collection.deleteOne({'ID': Document_ID});
            console.log('Operation completed: ', Result);

            // Closing the connection
            this.Client.close();
            console.log("Closed connection");
            return 1;


        } catch (error) {
            console.error(error.message);
            throw new Error("Document Deleting operation failed");
        }
    }

    /**
     * Function to find a playlist document from the database using its unique ID.
     * @param {number} Document_ID 
     * @returns {Object} Returns a Playlist document of secified document
     */

    async FindaPlaylist(Document_ID) {
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);
            console.log("Fetching Playlist data of ID: ", Document_ID)

            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = Collection.find({'ID': {$eq: Document_ID}}, { projection: { _id: 0 } });
            const Result = await Cursor.toArray();

            await this.Client.close();
            console.log("Closed connection");
            console.log("Result of the playlist Data: ", Result);

            if (Result) return Result[0];


        } catch (error){
            console.error("Error: " + error.message);
            // throw new Error("Cannot retrive the specific document." );
        }
    }

    /**
     * Function to return a Users Playlist document using User unique ID.
     * @param {number} Document_User_ID Users unique ID.
     */
    async FindaUserPlaylist(Document_User_ID) {
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);

            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = Collection.find({'UserId': {$eq: Document_User_ID}}, { projection: { _id: 0 } });
            const DocumentArray = await Cursor.toArray();
            

            // Closing the connection
            await this.Client.close();
            console.log("Closed connection");

            return DocumentArray;


        } catch (error){
            console.error("Error: " + error.message);
            throw new Error("Cannot retrive the specific document." );
        }
    }

    async FindallPlaylist(list){
        var Result = null;
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);
            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = Collection.find({'ID': {$in: list}}, { projection: { _id: 0 } });
            
            Result = await Cursor.toArray();

            this.Client.close();
            console.log("Closed connection");


        } catch (error){
            console.error("Playlist Error: - Error in server: " + error.message);
            console.log("Cannot retrive the specific document.");
        }

        if  (Result) return Result; else return 0;
    }
}

export default PlayListDetails;