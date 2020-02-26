var express = require('express');
var router = express.Router();
const FileTypeController = require('../server/controllers').FileTypeController;

router.get('/', FileTypeController.index);
router.get('/:User', FileTypeController.filesByUser)

module.exports = router;
