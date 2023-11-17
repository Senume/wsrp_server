import Playlist from '../src/utils/PlaylistClass';

describe("Creating an Playlist object from the Details", () => {

    const PlayListData = [
        {
          "playlistName": "Chill Vibes",
          "userID": 12345
        },
        {
          "playlistName": "Workout Jams",
          "userID": 67890
        },
        {
          "playlistName": "Study Beats",
          "userID": 54321
        },
        {
          "playlistName": "Party Anthems",
          "userID": 98765
        },
        {
          "playlistName": "Road Trip Tunes",
          "userID": 45678
        }
      ];
      

    it.each(PlayListData)('Creaing multiple objects', (Data) => {
        //Create an instance of PlayList
        const PlaylistObject = new Playlist(Data.playlistName, Data.userID);
        PlaylistObject.GenerateHashID();

        //Testing
        expect(PlaylistObject).not.toBeNull();
        expect(typeof PlaylistObject.ID).toBe('number');

    });
})

describe("Playlist Adding/Deleting songs into existig playlist", () => {
    //Creating an Playlist instance
    const PlaylistObject = new Playlist("Road Trip Tunes", 45678);
    PlaylistObject.GenerateHashID();

    //Testing - Adding
    const Songs = [8765432109, 23456789, 9876543210, 1234567890];

    it.each(Songs)("Adding a song into the playlist", (Id) => {
        const operation =  PlaylistObject.AddSong(Id);

        expect(PlaylistObject.SongList.length).not.toBeLessThanOrEqual(0);
        expect(typeof PlaylistObject.SongList).not.toBeNull();
        expect(operation).toBeTruthy();

    })
      
    //Testing - Deletion case 1
    it("Deleting an existing song in the playlist", () => {
        const Alen = PlaylistObject.SongList.length;
        const operation = PlaylistObject.DeleteSong(23456789);

        expect (operation).toBeTruthy();
        expect(Alen === PlaylistObject.SongList.length + 1).toBeTruthy();
    })

    //Testing - Deletion case 2
    it("Deleting an non-existing song in the playlist", () => {
        expect(() => PlaylistObject.DeleteSong(2)).toThrow("Song not in Playlist");
        expect(() => PlaylistObject.DeleteSong(2)).toThrow(Error);
    })


})