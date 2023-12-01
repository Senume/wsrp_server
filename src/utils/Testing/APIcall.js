import axios from 'axios';                  // Library to call API endpoints
import dotenv from 'dotenv';                // Provides a platform to have environment variables
import fs from 'fs';
import FormData from 'form-data';


                            

/**
 * @constructor Class to provide recognition functionality for given audio samples.
 * @param {number} userid User who tries to invoke the recognition functionality.
 * @param {Formdata} AudioForm The Sample audio is passed and stored as formdata.
 */
export default class Recognition{
    constructor(userid){
        this.UserID = userid;
        // this.AudioSample = AudioForm;
        this.endpoint = 'https://shazam-api7.p.rapidapi.com/songs/recognize-song';
    }

    /**
     * @function ProcessRecognition Function provides interface to invoking the recognition functionality just a function call.
     * @returns {object} Containing the details of the song.
     */
    async ProcessRecognition(DataForm) {
        // Initialize the environment variables
        dotenv.config();

        // Configuration of the 'Music Identity' API endpoint.
        const options = {
            method: 'POST',
            headers: {
              'X-RapidAPI-Key': process.env.APIKEY,
              'X-RapidAPI-Host': process.env.APIHOST,
              ...DataForm.getHeaders(),
            },
            body: DataForm
        };

        return await axios.post(this.endpoint, DataForm, options);
        
    };


}

const Data = new FormData();
Data.append('audio', fs.createReadStream("/home/senume/Project/FullStack/wsrp_server/test/SampleAudio/Song_5.mp3"));

console.log(Data);
// console.log(Data);

// const RecognitionObject = new Recognition("test/SampleAudio/Song_1.mp3");
// const Output = RecognitionObject.ProcessRecognition(Data);
// Output.then(response => {
//     if (response.status === 200) {
//         console.log('Success:', response.data);
//     } else {
//         console.error('Error:', response.status, response.statusText);
//     }
// }).catch(error => {
//     console.error('Error:', error);
// });