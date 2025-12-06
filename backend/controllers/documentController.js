const Document = require('../models/Document');
const upload = require('../middleware/multerMiddleware'); // Multer config
const fs = require('fs'); // Node's File System module for deleting/reading files
const path = require('path'); // Node's Path module for file paths

// --- CREATE (Upload) ---
// @route POST /api/documents/upload
// @desc Upload a new document
// @access Private
exports.uploadDocument = (req, res) => {
    // We wrap the Multer upload logic here
    upload(req, res, async (err) => {
        if (err) {
            // Handle Multer specific errors (file size limit, file type)
            return res.status(400).json({ msg: err });
        }
        
        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected!' });
        }

        try {
            // Save file metadata to MongoDB
            const newDocument = new Document({
                owner: req.user.id, // User ID comes from the authMiddleware
                fileName: req.file.originalname,
                filePath: req.file.filename, // Unique name Multer gave it
                fileType: req.file.mimetype,
                size: req.file.size,
            });

            const document = await newDocument.save();
            res.json(document);

        } catch (e) {
            console.error(e.message);
            // If DB save fails, clean up the uploaded file to prevent orphans
            if (req.file) {
                fs.unlink(req.file.path, () => {
                    console.log(`Cleaned up orphaned file: ${req.file.path}`);
                });
            }
            res.status(500).send('Server Error during DB save');
        }
    });
};

// --- READ (View All) ---
// @route GET /api/documents
// @desc Get all documents for the logged-in user
// @access Private
exports.getDocuments = async (req, res) => {
    try {
        // Find all documents where the owner matches the logged-in user's ID
        const documents = await Document.find({ owner: req.user.id }).sort({ uploadedDate: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- READ (Download) ---
// @route GET /api/documents/download/:docId
// @desc Download a specific document
// @access Private
exports.downloadDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Security check: Ensure the document belongs to the logged-in user
        if (document.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to download this file' });
        }

        // Create the full path to the file on the server.
        // It navigates up one directory (..) from 'controllers' and into 'uploads'.
        const filePath = path.join(__dirname, '..', 'uploads', document.filePath);
        
        // Log the path for debugging (can be removed later)
        console.log('Attempting to download file from:', filePath);

        // Use res.download() to send the file to the client
        // The second argument forces the download with the original filename
        res.download(filePath, document.fileName, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found on the server disk
                    console.error('File missing on disk:', filePath);
                    return res.status(404).send('Error: Physical file not found on server.');
                }
                console.error('Download error:', err.message);
                res.status(500).send('Could not download the file due to a server error.');
            }
        });

    } catch (err) {
        console.error(err.message);
        // Handle bad ObjectId format error
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
};

// --- UPDATE (Rename) ---
// @route PUT /api/documents/:docId
// @desc Rename/update document metadata (only fileName is supported here)
// @access Private
exports.renameDocument = async (req, res) => {
    const { newFileName } = req.body;

    try {
        let document = await Document.findById(req.params.docId);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Security check
        if (document.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update the file name if provided
        if (newFileName && newFileName.trim() !== '') {
            document.fileName = newFileName.trim();
        }
        
        await document.save();
        res.json(document);

    } catch (err) {
        console.error(err.message);
        // Handle bad ObjectId format error
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
};

// --- DELETE ---
// @route DELETE /api/documents/:docId
// @desc Delete document and its file permanently
// @access Private
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Security check
        if (document.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // 1. Delete the file from the server's file system
        const filePath = path.join(__dirname, '..', 'uploads', document.filePath);
        
        // Use fs.unlink to delete the file asynchronously
        fs.unlink(filePath, async (err) => {
            if (err) {
                // Log the file deletion error but continue to delete the DB record
                console.error("Error deleting physical file:", err.message);
                // NOTE: If the file is already gone (err.code === 'ENOENT'), we still delete the DB record.
            }

            // 2. Delete the metadata from MongoDB
            await Document.deleteOne({ _id: req.params.docId });

            res.json({ msg: 'Document removed successfully' });
        });

    } catch (e) {
        console.error(e.message);
        // Handle bad ObjectId format error
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
};