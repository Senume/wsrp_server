import hashIt from "hash-it";               // Library to handle Hash functionalities

/**
 * Class to store the Song details and use the object for further manipulation.
 * @construct 
 * @param {string} songTitle Title of the song
 * @param {string} songArtist Artist of the song
 * @param {string} songRelease Release of the song
 * @param {number} songDuration Duration of the song in seconds
 */
export default class Song {

    constructor(songTitle, songArtist, songRelease, songDuration){
        this.SongTitle = songTitle;                                                                     // Song Details - Title
        this.SongArtist = songArtist;                                                                   // Song Details - Artist        
        this.SongRelease = songRelease;                                                                 // Song Details - Release
        this.SongDuration = songDuration;                                                               // Song Details - Duration
        this.ID = 0;                                                                                    // Unique ID will be generated based on the Song Details
    }
    
    /** 
     * Generates a unique Id for the object created. It uses hashing and the 
     * details of the song to generate the unique ID. This need to be called 
     * separately. Not integrated with constructor.
     * @returns {number} Unique ID for the object created.
    */
    GenerateHashID() {
        const TempID =  hashIt((this.SongTitle + this.SongArtist + this.SongDuration).toUpperCase());   // Hashing Song details based on the Song Details
        this.ID = TempID;                                                                               // Updating the Unique ID.
        return this.ID;                                                                                 // Logging purpose.
    }

    /** Gets the song object as javascript object
     * @return {Object} Object with containing properties title, artist, duration, release description
    */
    GetSongDetails() {
        const Details = {
            id: this.ID,
            title: this.songTitle,
            artist: this.songArtist,
            duration: this.SongDuration,
            release: this.songRelease
        }
        return Details;
    }

};

