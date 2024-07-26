const express = require('express');
const {createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument}  = require('../controllers/documentController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;