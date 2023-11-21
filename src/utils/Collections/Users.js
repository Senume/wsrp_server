import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";
import { platform } from "os";

/* Users class for managing users
   Functionalities provided
 * Add users : AddUser(user)
 * Find users : Finduser(user name)
 * update user details : UpdateUser(user name, {update fields})
 */

class Users {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.bucketName = "Users";
    this.client = new MongoClient(this.uri);
  }

  // add a new user to the collection
  async AddUser(user) {
    // connectf
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

      const insertResult = await collection.insertOne(user);
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

  // find the user from the collection
  // returns the user details as array
  async Finduser(name) {
    {
      try {
        await this.client.connect();
        console.log("connected to the db");
      } catch (error) {
        console.error("couldn't connect", error);
      }
    }
    let findResult;
    try {
      const database = this.client.db(this.dbName);
      const collection = database.collection(this.bucketName);

      findResult = await collection.find({ name: name }).toArray();
    } catch (error) {
      console.error("error finding them", error);
    }

    {
      try {
        await this.client.close();
        console.log("disconnected");
      } catch (error) {
        console.error("couldnt disconnect", error);
      }
    }
    return findResult;
  }

  // updates the user details
  async UpdateUser(name, update) {
    {
      try {
        await this.client.connect();
        console.log("Connected");
      } catch (error) {
        console.error("cpuldnt connect");
      }
    }

    const database = this.client.db(this.dbName);
    const collection = database.collection(this.bucketName);

    try {
      const UpdateResult = await collection.updateOne(
        { name: name },
        { $set: update }
      );
      console.log(`updated ${UpdateResult.modifiedCount}`);
    } catch (error) {
      console.error("couldnt update");
    }

    try {
      await this.client.close();
      console.log("DisConnected");
    } catch (error) {
      console.error("cpuldnt Disconnect");
    }
  }
}
export default Users;

/* Example Use
// module.exports = Users;
async function musictry() {
  const manager = new Users("mongodb://0.0.0.0:27017", "Songs");
  await manager.AddUser({
    name: "Viswes",
    age: 16,
  });
  console.log(await manager.Finduser("Viswes"));
  await manager.UpdateUser("Viswes", { age: 18, gender: "male" });
}

// musictry();
*/
