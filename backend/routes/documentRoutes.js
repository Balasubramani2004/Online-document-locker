// backend/routes/documentRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // For protecting all routes
const documentController = require('../controllers/documentController');

// Every route in this file uses the 'auth' middleware, making them private (protected)

// @route POST /api/documents/upload
// @desc Upload a new document
router.post('/upload', auth, documentController.uploadDocument);

// @route GET /api/documents
// @desc Get all documents for the logged-in user
router.get('/', auth, documentController.getDocuments);

// @route GET /api/documents/download/:docId
// @desc Download a specific document
router.get('/download/:docId', auth, documentController.downloadDocument);

// @route PUT /api/documents/:docId
// @desc Rename document metadata
router.put('/:docId', auth, documentController.renameDocument);

// @route DELETE /api/documents/:docId
// @desc Delete document and its file
router.delete('/:docId', auth, documentController.deleteDocument);

module.exports = router;