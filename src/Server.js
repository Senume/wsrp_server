import express from "express";
import multer from "multer";
import path from "path";


const app = express();
const port = 3500;

// Set storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle POST request with file upload
app.post('/upload', upload.single('Audio'), (req, res) => {
//   if (!req.AudioForm) {
//     return res.status(400).send('No files were uploaded.');
//   }
    console.log("File Received");
    res.status(200);


});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
