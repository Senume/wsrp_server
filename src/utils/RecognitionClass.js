import axios from 'axios';                  // Library to call API endpoints
import dotenv from 'dotenv';                // Provides a platform to have environment variables         

/**
 * @constructor Class to provide recognition functionality for given audio samples.
 * @param {number} userid User who tries to invoke the recognition functionality.
 * @param {Formdata} AudioForm The Sample audio is passed and stored as formdata.
 */
export default class Recognition{
    constructor(){
        this.endpoint = 'https://shazam-api7.p.rapidapi.com/songs/recognize-song';
    }

    /**
     * @function ProcessRecognition Function provides interface to invoking the recognition functionality just a function call.
     * @returns {object} Containing the details of the song.
     */
    async ProcessRecognition(base64) {
        // Initialize the environment variables
        dotenv.config();

        const options = {

            method: 'POST',
            url: 'https://shazam.p.rapidapi.com/songs/detect',
            headers: {
              'content-type': 'text/plain',
              'X-RapidAPI-Key': process.env.APIKEY,
              'X-RapidAPI-Host': process.env.APIHOST
            },
            data: base64
          };
          
          try {
              const response = await axios.request(options);
              return response.data;
          } catch (error) {
              console.error(error);
        }
        

        
        
    };


}