import { MongoClient} from "mongodb";

/** Class to define the abstracted functionalities of SongDetail Database operation.
 * @contructor
 * @param {string} URI The URI of the database server.
 * @param {string} dbName The name of the Database on the server.
*/
class SongDetails {
    constructor(URI, dbName) {
        this.URI = URI;
        this.DBName = dbName;
        this.BucketName = "SongDetails";
        this.Client = new MongoClient(this.URI, { maxConnecting: 10});
    }

    /**
     * Function to add a single song detail or update it.
     * @param {object} Data Pass-in the data which in be appended to collection 'SongDetails'.
     * @returns {boolean} return true if successful or raise an error otherwise.
     */
    async UpdateSongDetails(Data){

        try {
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

    /**
     * Function to find a specific document in the database collection 'SongDetails'.
     * @param {number} Document_ID Unique ID of the document.
     * @returns {json} Returns JSON representation of the document.
     */
    async FindaDocument(Document_ID) {
        var Result = null;
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);
            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            
            const Cursor = Collection.find({'ID': Document_ID}, { projection: { _id: 0 } });
            
            Result = await Cursor.toArray();

            this.Client.close();
            console.log("Closed connection");

            
            // if (Result.length === 0) return 0; else 


        } catch (error){
            console.error("Error in server while closing connection: " + error.message);
            // throw new Error("Cannot retrive the specific document." );
        }

        if  (Result) return Result[0]; else console.log("Problem")
    }

    async FindingallSongs(List) {
        var Result = null;
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);
            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = Collection.find({'ID': {$in: List}}, { projection: { _id: 0 } });
            
            Result = await Cursor.toArray();

            this.Client.close();
            console.log("Closed connection");


        } catch (error){
            console.error("Error in server while closing connection: " + error.message);
            // throw new Error("Cannot retrive the specific document." );
            return 0
        }

        if  (Result) return Result; else return 0;
    }

    async FindAllSongsDatabase() {
        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);
            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = Collection.find({}, {projection: { ID: 1, _id: 0}});
            
            var Result = await Cursor.toArray();
            Result = Result.map(item => {return item.ID});

            this.Client.close();
            console.log("Closed connection");

            return Result


        } catch (error){
            console.error("Error in server while closing connection: " + error.message);
            // throw new Error("Cannot retrive the specific document." );
            return 0
        }

    }

};

export default SongDetails;