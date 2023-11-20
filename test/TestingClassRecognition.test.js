import Recognition from "../src/utils/RecognitionClass";
import hashIt from "hash-it";
import fs from "fs";
import FormData from 'form-data';

describe("Checking for reponse for the following API request", () => {
        
    URL = [
        {url : "test/SampleAudio/Song_1.mp3" },
        {url : "test/SampleAudio/Song_2.mp3" }
    ]

    it("Testing if the API request is accepted (Noisiy Sample test)", () => {
        const Data = new FormData();
        Data.append('file', fs.createReadStream(URL[0].url));

        // console.log(Data);
    
        const RecognitionObject = new Recognition(hashIt(URL[0].url), Data);
        const Output = RecognitionObject.ProcessRecognition();

        console.log(Output);
        Output.then((result) => {
            const Data = result.text();
            console.log(Data);
        }).catch((err) => { console.log(err); });
            
        // expect(typeof Output).toBe('object');


    })
})