import { MongoClient } from "mongodb";
/**
 * @constructor
 * @param {string} URI URI of the database server
 * @param {string} dbName Name of the database on the server
 */
class UsersDetails {
  constructor(URI, dbName) {
    this.URI = URI;
    this.DBName = dbName;
    this.BucketName = "UserDetails";
    this.Client = new MongoClient(this.URI);
  }

  /**
   * Function to find a user in the database collection 'UserDetails' and return the details of it
   * @param {any} UserName
   * @returns javscript object of user details
   */
  async FindUser(UserName) {
    try {
      await this.Client.connect();
      console.log("Connected to the mongo server at " + this.URI);

      // Appending a document into the collection
      const DataBase = this.Client.db(this.DBName);
      const Collection = DataBase.collection(this.BucketName);

      // Finding the first document in the collection
      const Cursor = Collection.find(
        { UserName: { $eq: UserName } },
        { projection: { _id: 0 } }
      );
      const Result = await Cursor.toArray();

      await this.Client.close();
      console.log("Closed connection");

      if (Result.length === 0) return 0;
      else return Result[0];
    } catch (error) {
      console.error("Error: " + error.message);
      throw new Error("Cannot retrive the specific document.");
    }
  }

  /**
   *
   * @param {object} Data Users data object that needs to be added in the database.
   * @returns boolean true if successful registration, false otherwise.
   */
  async UpdateUser(Data) {
    try {
      // Connecting to MongoDB server
      await this.Client.connect();
      console.log("Connected to the mongo server at " + this.URI);

      // Appending a document into the collection
      const DataBase = this.Client.db(this.DBName);
      const Collection = DataBase.collection(this.BucketName);
      // console.log("hello", Data);
      const Result = await Collection.updateOne(
        { UserName: { $eq: Data.Username } },
        {
          $set: {
            PlaylistList: Data.PlaylistList,
            HistoryList: Data.HistoryList,
            CurrentSong: Data.CurrentSong,
          },
        },
        { upsert: true }
      );
      console.log("Successful operation: ", Result);

      // Closing the connection
      this.Client.close();
      console.log("Closed connection");
      return 1;
    } catch (error) {
      console.error(error.message);
      throw new Error("Document modifying operation failed");
    }
  }

  async AddUser(Data) {
    try {
      // Connecting to MongoDB server
      await this.Client.connect();
      console.log("Connected to the mongo server at " + this.URI);

      // Appending a document into the collection
      const DataBase = this.Client.db(this.DBName);
      const Collection = DataBase.collection(this.BucketName);

      const Result = await Collection.insertOne({
        ...Data,
        PlaylistList: [],
        HistoryList: [],
        CurrentSong: [],
      });
      console.log("Successful operation: ", Result);

      // Closing the connection
      this.Client.close();
      console.log("Closed connection");
      return 1;
    } catch (error) {
      console.error(error.message);
      throw new Error("Document adding operation failed");
    }
  }

  async UpdateUserProfile(Data) {
    try {
      // Connecting to MongoDB server
      await this.Client.connect();
      console.log("Connected to the mongo server at " + this.URI);

      // Appending a document into the collection
      const DataBase = this.Client.db(this.DBName);
      const Collection = DataBase.collection(this.BucketName);
      // console.log("hello", Data);
      const Result = await Collection.updateOne(
        { UserName: { $eq: Data.OldUser } },
        {
          $set: {
            UserName: Data.Username,
            email: Data.email,
            // password: Data.HistoryList,
            age: Data.age,
            gender: Data.gender,
          },
        },
        { upsert: true }
      );
      console.log("Successful operation: ", Result);

      // Closing the connection
      this.Client.close();
      console.log("Closed connection");
      return 1;
    } catch (error) {
      console.error(error.message);
      throw new Error("Document modifying operation failed");
    }
  }
}

export default UsersDetails;
