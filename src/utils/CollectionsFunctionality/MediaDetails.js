import { MongoClient, GridFSBucket } from "mongodb";
import express from "express";
import fs from "fs";

class MediaDetails {
    constructor(uri, dbName) {
      this.uri = uri;
      this.dbName = dbName;
      this.bucketName = "Media";
      this.client = new MongoClient(this.uri);
    }
  
    async uploadMP3File(filePath, metadata) {
      try {
        await this.client.connect();
        console.log("Connected to the database");
  
        const database = this.client.db(this.dbName);
        const bucket = new GridFSBucket(database, {
          bucketName: this.bucketName,
        });
  
        const readStream = fs.createReadStream(filePath);
        const writeStream = bucket.openUploadStream(Number(metadata));
  
        readStream.pipe(writeStream);
  
        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });
        return writeStream.id.toString();
      } catch (error) {
        console.error("Error uploading MP3 file:", error);
      } finally {
        await this.client.close();
        console.log("Connection closed");
      }
  
      return "Added";
    }
  
    /* download the song with the 'title' to the destination
      return - null */
    async downloadMP3File(title, destinationPath) {
      try {
        await this.client.connect();
        console.log("Connected to the database");
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
      try {
        const database = this.client.db(this.dbName);
  
        // Create a GridFSBucket
        const bucket = new GridFSBucket(database, {
          bucketName: this.bucketName,
        });
  
        // Open a writable stream to save the file locally
        const writeStream = fs.createWriteStream(destinationPath);
  
        // Create a readable stream to retrieve the file from GridFS
        const readStream = bucket.openDownloadStreamByName(title);
  
        // Pipe the file data to the local file
        readStream.pipe(writeStream);
  
        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });
      } catch (error) {
        console.error("Error downloading MP3 file:", error);
      }
      try {
        await this.client.close();
        console.log("Connection closed");
      } catch (error) {
        console.error("Error closing the connection:", error);
      }
      return "Downloaded";
    }

    async FindAllSongsDatabase() {
        
        await this.client.connect();
        console.log("Connected to the mongo server at " + this.URI);
        // Appending a document into the collection
        const DataBase = this.client.db(this.dbName);
        const Collection = DataBase.collection(this.bucketName + '.files');

        // Finding the first document in the collection
        const Cursor = Collection.find({}, {projection: { filename: 1, _id: 0}});
        
        var Result = await Cursor.toArray();
        Result = Result.map(item => {return item.filename});

        this.client.close();
        console.log("Closed connection");

        return Result


    } catch (error){
        console.error("Error in server while closing connection: " + error.message);
        // throw new Error("Cannot retrive the specific document." );
        return 0
    }
    
}

export default MediaDetails;