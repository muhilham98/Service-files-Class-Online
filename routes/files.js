const express = require('express');
const router = express.Router();
const apiFileController = require('../controllers/apiFileController');
const { upload } = require('../middlewares/multer');
//const { upload, uploadMultiple } = require('../middlewares/multer');


/* GET users listing. */
router.post('/', apiFileController.addFile);
router.get('/', apiFileController.getFiles);
router.delete('/:id', apiFileController.deleteFile);

module.exports = router;
