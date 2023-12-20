import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";
import { platform } from "os";

/* Users class for managing users
   Functionalities provided
 * Find users : Finduser(user name)
 * update user details : UpdateUser({update fields})
 */

class Users {
    constructor(uri, dbName) {
        this.uri = uri;
        this.dbName = dbName;
        this.bucketName = "Users";
        this.client = new MongoClient(this.uri);
    }

    // add a new user to the collection
    async UpdateUser(user) {
        // connectf
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
            UserName: user.UserName,
        });

        let result;
        if (!existingDocument) {
            try {
                const insertResult = await collection.insertOne(user);
                console.log(
                    `Inserted document with ID: ${insertResult.insertedId}`
                );
                result = insertResult.insertedId;
            } catch (error) {
                console.error("Error inserting document:", error);
            }
        } else {
            try {
                const UpdateResult = await collection.updateOne(
                    { UserName: user.UserName },
                    { $set: user }
                );
                console.log(`updated ${UpdateResult.modifiedCount}`);
                result = UpdateResult.modifiedCount;
                console.log(typeof result);
            } catch (error) {
                console.error("couldnt update", error);
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

    // find the user from the collection
    // returns the user details as array
    async Finduser(UserName) {
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

            findResult = await collection
                .find({ UserName: UserName })
                .toArray();
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
}
export default Users;
