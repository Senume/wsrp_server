import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";
import { platform } from "os";

/* PLaylist Class for managing playlist
   Supported Functionalities
   1. make a new playlist : MakePlaylist({playlist}) 
   2. Update a Playlist : UpdatePlaylist(name, editorname, updatesong,decision(add/remove)) 
   3. Find a Playlist : FindPlaylist(playlistname) 
  */
class Playlist {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.bucketName = "Playlist";
    this.client = new MongoClient(this.uri);
  }

  // Add a playlist to the collection by {name , songs} dictionary
  async MakePlaylist(playlist) {
    // connect
    {
      try {
        await this.client.connect();
        console.log("Connected to the database");
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
    }

    try {
      const database = this.client.db(this.dbName);
      const collection = database.collection(this.bucketName);

      const insertResult = await collection.insertOne(playlist);
      console.log(`Inserted document with ID: ${insertResult.insertedId}`);
    } catch (error) {
      console.error("Error inserting document:", error);
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
  }

  // edit the playlist
  async UpdatePlaylist(toupdate, editorname, ChangeSongs, decision) {
    try {
      await this.client.connect();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
    const database = this.client.db(this.dbName);
    const collection = database.collection(this.bucketName);

    if (decision == "add") {
      try {
        const updateResult = await collection.updateMany(
          { name: toupdate },
          {
            $set: { editor: editorname },
            $push: { songs: { $each: ChangeSongs } },
          }
        );
        console.log(`Added into ${updateResult.modifiedCount} document`);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else if (decision == "remove") {
      try {
        const updateResult = await collection.updateMany(
          { name: toupdate },
          {
            $set: { editor: editorname },
            $pull: { songs: { $in: ChangeSongs } },
          }
        );
        console.log(`Removed from ${updateResult.modifiedCount} document`);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }

    try {
      await this.client.close();
      console.log("Connection closed");
    } catch (error) {
      console.error("Error closing the connection:", error);
    }
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

// module.exports = Playlist;
export default Playlist;

/* Example Use
const PlaylistHandler = new Playlist("mongodb://0.0.0.0:27017", "Songs");

async function runPlaylist() {
  await PlaylistHandler.MakePlaylist({
    name: "Liked Songs",
    songs: ["The Nights", "The Oldies", "The newons"],
  });

  // await PlaylistHandler.UpdatePlaylist(
  //   "Liked Songs",
  //   "Viswes",
  //   ["The Eves", "The Mornings"],
  //   "add"
  // );

  await PlaylistHandler.UpdatePlaylist(
    "Liked Songs",
    "Viswes",
    ["The Nights", "The Oldies"],
    "remove"
  );

  console.log(PlaylistHandler.FindPlaylist("The Nights"));
}

// runPlaylist();
*/
