
import Song from "../src/utils/SongClass";
import hashIt from "hash-it";

describe("Creating 'Song' Object", () => {
    
    // Data to test on the class
    const UserData = [ 

        //Structure of the Data in Array:[SongDetails, ObservedResult]
        // -------1-------
        [{
            title: "Shape of You",
            artist: "Ed Sheeran",
            duration: 234,
            release: "2017-01-06",
        }, hashIt(("Shape of You" + "Ed Sheeran" + 234).toUpperCase())],
        //-------2-------
        [{
            "title": "Blinding Lights",
            "artist": "The Weeknd",
            "duration": 200,
            "release": "2019-11-29"
        }, hashIt(("Blinding Lights" + "The Weeknd" + 200).toUpperCase())],
        //-------3-------
        [{
            "title": "Someone You Loved",
            "artist": "Lewis ##$Capaldi",
            "duration": 182,
            "release": "2018-11-08"
        }, hashIt(("Someone You Loved" + "Lewis ##$Capaldi" + 182).toUpperCase())],
        //-------4-------
        [{
            "title": "Dance Monkey",
            "artist": "Tones23233 and I",
            "duration": 209,
            "release": "2019-05-10"
        }, hashIt(("Dance Monkey" + "Tones23233 and I" + 209).toUpperCase())],
        //-------5-------
        [{
            "title": "Uptown F234@#$unk",
            "artist": "Mark Ronson ft. Bruno Mars",
            "duration": 270,
            "release": "2014-11-10"
        }, hashIt(("Uptown F234@#$unk" + "Mark Ronson ft. Bruno Mars" + 270).toUpperCase())]

    ];

    // Checking if it accepts all value of inputs
    it.each(UserData)("Creating new class 'Song' object", (Data, result) => {
        //Object generation
        const SongObject = new Song(Data.title, Data.artist, Data.release,Data.duration);

        expect(typeof SongObject.GenerateHashID()).toBe('number');    // Generating Unique ID for Song object and checking

        //Testing 
        expect(SongObject.ID).not.toBeNaN();             // ID should not be NaN
        expect(SongObject.ID).not.toBeNull();            // ID should be null
        expect(typeof SongObject.ID).toBe('number');     // ID should be a number
        expect(SongObject.ID).toEqual(result);           // ID should be equal to Observed Result
    });
})

describe("Retriving Song Object data", () => {
    const UserData = 
        {
            title: "Shape of You",
            artist: "Ed Sheeran",
            duration: 234,
            release: "2017-01-06",
        }
    
    it("Getting value from object", () => {
        //Object generation
        const SongObject = new Song(UserData.title, UserData.artist, UserData.release,UserData.duration);
        SongObject.GenerateHashID();    // Generating Unique ID for Song object

        // Testing
        expect(SongObject.GetSongDetails()).not.toBeNaN();
        expect(SongObject.GetSongDetails()).not.toBeNull();
        expect(typeof SongObject.GetSongDetails()).toBe('object');

    })


})