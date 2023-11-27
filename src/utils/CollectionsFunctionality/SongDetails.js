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
        this.Client = new MongoClient(this.URI);
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

        try {

            await this.Client.connect();
            console.log("Connected to the mongo server at " + this.URI);

            // Appending a document into the collection
            const DataBase = this.Client.db(this.DBName);
            const Collection = DataBase.collection(this.BucketName);

            // Finding the first document in the collection
            const Cursor = await Collection.find({'ID': {$eq: Document_ID}}, { projection: { _id: 0 } });
            const Result = await Cursor.toArray();

            await this.Client.close();
            console.log("Closed connection");

            if (Result.length === 0) return 0; else return Result[0];


        } catch (error){
            console.error("Error: " + error.message);
            throw new Error("Cannot retrive the specific document." );
        }
    }



};

export default SongDetails;