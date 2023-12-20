import { MongoClient } from "mongodb";
import SongDetails from "../CollectionsFunctionality/SongDetails.js";
import UserDetails from "../CollectionsFunctionality/UserDetails.js";

const url = "mongodb://localhost:27017";
const dbName = "Testing";

const SongCRUD = new UserDetails(url, dbName);

const Data = [
    {
        UserName: "user1",
        Email: "user1@example.com",
        UserType: "Admin",
    },
    {
        UserName: "user2",
        Email: "user2@example.com",
        UserType: "Regular",
    },
    {
        UserName: "user3",
        Email: "user3@example.com",
        UserType: "Guest",
    },
    {
        UserName: "user4",
        Email: null,
        UserType: null,
    },
];

// for (let sample of Data) {
//     console.log("----");
//     console.log(sample);
//     const res = await SongCRUD.UpdateUser(sample);
//     console.log(res);
// }

const Doc = await SongCRUD.FindUser("user5");
console.log("Output: ", Doc);
