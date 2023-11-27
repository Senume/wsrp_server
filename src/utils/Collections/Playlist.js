import { MongoClient} from "mongodb";
import fs from "fs";
import { platform } from "os";

/* PLaylist Class for managing playlist
   Supported Functionalities
   1. Update a Playlist : UpdatePlaylist(playlist details) 
   2. Find a Playlist : FindPlaylist(playlistname) 
  */
class Playlist {
  constructor(URI, dbName) {
    this.URI = URI;
    this.DBName = dbName;
    this.BucketName = "PlaylistDetails";
    this.Client = new MongoClient(this.uri);
  }

  // Add a playlist to the collection by {name , songs} dictionary
  async UpdatePlaylist(playlist) {
    // connect
    {
      try {
        await this.client.connect();
        console.log("Connected to the database");
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
    }
    const database = this.client.db(this.dbName);
    const collection = database.collection(this.bucketName);
    const existingDocument = await collection.findOne({
      name: playlist.name,
    });
    let result;
    if (!existingDocument) {
      try {
        const insertResult = await collection.insertOne(playlist);
        console.log(`Inserted document with ID: ${insertResult.insertedId}`);
        result = insertResult.insertedId;
      } catch (error) {
        console.error("Error inserting document:", error);
      }
    } else {
      if (playlist.decision == "add") {
        try {
          const updateResult = await collection.updateMany(
            { name: playlist.name },
            {
              $set: { editor: playlist.editor },
              $push: { songs: { $each: playlist.songs } },
            }
          );
          // console.log(`Added into ${updateResult.modifiedCount} document`);
          result = updateResult.modifiedCount;
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else if (playlist.decision == "remove") {
        try {
          const updateResult = await collection.updateMany(
            { name: playlist.name },
            {
              $set: { editor: playlist.editor },
              $pull: { songs: { $in: playlist.songs } },
            }
          );
          console.log(`Updated from ${updateResult.modifiedCount} document`);
          result = updateResult.modifiedCount;
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    }
    // close
    {
      try {
        await this.client.close();
        console.log("Connection closed");
      } catch (error) {
        console.error("Error closing the connection:", error);
      }
    }
    return result;
  }

  // find the playlist
  // returns the playlist object from the collection
  async FindPlaylist(name) {
    // connect
    {
      try {
        await this.client.connect();
        console.log("Connected to the database");
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
    }
    let findResult;
    try {
      const database = this.client.db(this.dbName);
      const collection = database.collection(this.bucketName);

      findResult = await collection.find({ name: name }).toArray();
      console.log("Found documents:", findResult);
    } catch (error) {
      console.error("Error finding documents:", error);
    }

    // close
    {
      try {
        await this.client.close();
        console.log("Connection closed");
      } catch (error) {
        console.error("Error closing the connection:", error);
      }
    }
    return findResult;
  }
}

export default Playlist;
