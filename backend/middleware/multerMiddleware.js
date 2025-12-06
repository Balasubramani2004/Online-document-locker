// backend/middleware/multerMiddleware.js

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Must match the folder created in Step 7
    filename: function(req, file, cb){
        // We generate a unique file name using the current timestamp + original extension
        // This prevents users from overwriting each other's files.
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB (in bytes)
    fileFilter: function(req, file, cb){
        // Call the checkFileType function below to validate the file
        checkFileType(file, cb);
    }
}).single('document'); // This specifies that we expect a single file under the field name 'document'

// Check File Type function
function checkFileType(file, cb){
    // Allowed file extensions (Regex check)
    const filetypes = /jpeg|jpg|png|pdf|docx|doc/;
    
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        // Error message if file type is not allowed
        cb('Error: Only PDF, JPG, PNG, DOCX, and DOC files are allowed!');
    }
}

module.exports = upload;