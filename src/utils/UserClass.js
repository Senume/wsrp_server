export default  class User {

    constructor(username, password) {
        this.Username = username;
        this.Email =null;
        this.UserType = null;
        this.PlaylistList = [];
        this.MasterKey = null;

    }

    UploadSample(AudioFormFormat) {console.log("UploadSample for recognition")};

    Login(){console.log("Login Process initiated")};

    CreatePlaylist(playlistname){console.log("Create Playlist query initiated")};

    AddToPlaylist(playlistid){console.log("Add a song to respective playlist")};

    RegisterUser(username, password){console.log("Register the user")};
}