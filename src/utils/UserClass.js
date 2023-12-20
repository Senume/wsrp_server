export default class User {
    /**
     *
     * @param {any} UserName Unique ID for logged-in user
     * @param {any} password password to grant access token to logged-in user.
     */
    constructor(UserName) {
        this.UserName = UserName;
        this.Email = null;
        this.UserType = null;
        this.PlaylistList = [];
        this.HistoryList = [];
        this.accessToken = null;
    }

    /**
     * Function to return User data.
     * @returns Returns information as javscript object
     */
    GetUserDetails() {
        const details = {
            UserName: this.UserName,
            Email: this.Email,
            UserType: this.UserType,
            PlaylistList: this.PlaylistList,
            HistoryList: this.HistoryList,
        };
        return details;
    }

    /**
     * Updates the access token for the current logged-in user.
     * @param {any} accessToken
     */
    UpdateAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    UploadSample(AudioFormFormat) {
        console.log("UploadSample for recognition");
    }

    Login() {
        console.log("Login Process initiated");
    }

    CreatePlaylist(playlistname) {
        console.log("Create Playlist query initiated");
    }

    AddToPlaylist(playlistid, songid) {
        console.log("Add a song to respective playlist");
    }

    RegisterUser(UserName, password) {
        console.log("Register the user");
    }
}
