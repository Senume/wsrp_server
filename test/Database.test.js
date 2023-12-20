import Database from "../src/utils/Collections/DatabaseClass.js";
// const { Database } = require("./DatabaseClass");

const DB = new Database("mongodb://0.0.0.0:27017", "Songs");

// User Tests
describe("User", () => {
    // Add New user
    const user = {
        UserName: "Chub16",
        name: "Chubmani",
        age: 16,
    };
    it("Add the user", async () => {
        const addedUser = await DB.UsersDB.UpdateUser(user);
        expect(addedUser).not.toBeNull();
    });

    // Search user
    const UserName = "Chubmani";
    it("search user", async () => {
        const FoundUser = await DB.UsersDB.Finduser(UserName);
        expect(FoundUser).not.toBeNull();
    });
    const user2 = {
        UserName: "Chub16",
        name: "Chubi",
        age: 17,
    };
    it("Update user", async () => {
        const UpdateUser = await DB.UsersDB.UpdateUser(user2);
        expect(UpdateUser).toEqual(1);
    });
});

// History Test
describe("History", () => {
    const UserName = "Viswes";
    const songs = ["The Nights", "The Moon", "The Eve"];
    it("Add history", async () => {
        const UpdateUser = await DB.HistoryDB.UpdateHistory(UserName, songs);
        expect(UpdateUser).not.toBeNull();
    });
});

// Playlist
describe("Playlist", () => {
    const playlist = {
        name: "Liked Songs",
        songs: ["The Nights", "The Oldies", "The Neons"],
    };
    it("New Playlist", async () => {
        const newplaylist = await DB.PlaylistDB.UpdatePlaylist(playlist);
        expect(newplaylist).not.toBeNull();
    });
    const updateplaylist = {
        name: "Liked Songs",
        editor: "Chubramani",
        decision: "add",
        songs: ["The Nights", "The mornings"],
    };
    it("Update Playlist", async () => {
        const newplaylist = await DB.PlaylistDB.UpdatePlaylist(updateplaylist);
        expect(newplaylist).toEqual(1);
    });

    it("Find Playlist", async () => {
        const newplaylist = await DB.PlaylistDB.FindPlaylist("Liked Songs");
        expect(newplaylist).not.toBeNull();
    });
});

describe("Songs", () => {
    it("Add song", async () => {
        const addsong = await DB.SongsDB.uploadMP3File(
            "C:/Users/Visweswaran/Downloads/Nights.mp3",
            {
                filename: "Nights.mp3",
                title: "The Nights",
                artist: "Avici",
            }
        );
        expect(addsong).not.toBeNull();
    });
    it("Download song", async () => {
        const downloadsong = await DB.SongsDB.downloadMP3File(
            "The Nights",
            "C:/Users/Visweswaran/Downloads/FromNights.mp3"
        );
        expect(downloadsong).toEqual("Downloaded");
    });
});
