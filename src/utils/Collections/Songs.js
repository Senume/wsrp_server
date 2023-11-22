import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";

/**
 * Songs Class for the Song Collection
 * Supported Functionalities
 * 1. Upload Songs : uploadMP3File(filepath,metadata)
 * 2. Download Songs : downloadMP3File(title,destination)
 */
class Songs {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.bucketName = "songl";
    this.client = new MongoClient(this.uri);
  }

  /* upload an mp3 file with filepath and metadata
     return - null */
  async uploadMP3File(filePath, metadata) {
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

      const bucket = new GridFSBucket(database, {
        bucketName: this.bucketName,
      });

      const readStream = fs.createReadStream(filePath);

      const writeStream = bucket.openUploadStream(metadata.title, {
        metadata,
      });

      readStream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    } catch (error) {
      console.error("Error uploading MP3 file:", error);
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
}

export default Songs;
