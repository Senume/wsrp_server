import { MongoClient, GridFSBucket } from "mongodb";
import express from "express";
import fs from "fs";
/**
 * Songs Class for the Song Collection
 * Supported Functionalities
 * 1. Upload Songs : uploadMP3File(filepath,metadata)
 * 2. Download Songs : downloadMP3File(title,destination)
 * 3. Stream Songs : createStreamingEndpoint()
 */
class Songs {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.bucketName = "songl";
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
      const writeStream = bucket.openUploadStream(metadata.title, {
        metadata,
      });

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

  // streaming endpoint
  async createStreamingEndpoint() {
    const app = express();
    await this.client.connect();
    console.log("Connected to the database");
    app.get("/stream/:fileID", async (req, res) => {
      const fileID = req.params.fileID;

      try {
        const database = this.client.db(this.dbName);
        const bucket = new GridFSBucket(database, {
          bucketName: this.bucketName,
        });

        const readStream = bucket.openDownloadStreamByName(fileID);
        readStream.pipe(res);
      } catch (error) {
        console.error("Error streaming file:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    const PORT = 3000;
    const server = app.listen(PORT, () => {
      console.log(`Streaming server is running on port ${PORT}`);
    });
    process.on("SIGINT", async () => {
      console.log("Server is shutting down...");
      await this.client.close();
      console.log("Connection closed");
      server.close(() => {
        console.log("Server stopped");
        process.exit(0);
      });
    });
  }
}

export default Songs;
