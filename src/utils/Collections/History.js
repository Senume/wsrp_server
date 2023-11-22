import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";
import { hostname, platform } from "os";
import exp from "constants";

/**
 * History Class for the History Collection
 * Supported Functionalities
 * 1. Update a users History by name : UpdateHistory(name , update details)
 */
class History {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.bucketName = "History";
    this.client = new MongoClient(this.uri);
  }

  /* Update the history by the user's name
  args : user name
  update : updating list of songs
  */
  async UpdateHistory(name, update) {
    {
      try {
        await this.client.connect();
        console.log("connected");
      } catch (error) {
        console.error("couldnt connect", error);
      }
    }
    const database = this.client.db(this.dbName);
    const collection = database.collection(this.bucketName);
    const existingDocument = await collection.findOne({ name: name });

    /* if record already found then update 
    else insert as a new record */
    if (existingDocument) {
      try {
        const UpdateResult = collection.updateOne(
          { name: name },
          { $push: { songs: { $each: update } } }
        );
        console.log(`Updated see ${(await UpdateResult).modifiedCount}`);
      } catch (error) {
        console.error("couldnt add", error);
      }
    }
    // else add a new history
    else {
      try {
        const InsertResult = await collection.insertOne({
          name: name,
          songs: update,
        });
        console.log(`inserted history ,${InsertResult.insertedId} `);
      } catch (error) {
        console.error("couldnt add", error);
      }
    }
    {
      try {
        await this.client.close();
        console.log("Disconnected");
      } catch (error) {
        console.error("couldnt Disconnect", error);
      }
    }
  }
}

export default History;
