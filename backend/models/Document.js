// backend/models/Document.js

const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    // User who owns this document - essential for security
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: { // Original file name
        type: String,
        required: true,
        trim: true,
    },
    // The unique name/path the file is saved as on the server
    filePath: { 
        type: String,
        required: true,
    },
    fileType: { // e.g., 'application/pdf', 'image/jpeg'
        type: String,
        required: true,
    },
    size: { // Size in bytes
        type: Number,
        required: true,
    },
    uploadedDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Document', DocumentSchema);