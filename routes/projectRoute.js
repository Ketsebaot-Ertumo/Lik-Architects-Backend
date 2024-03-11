const express = require('express');
const { create, project, getAll, edit, deletePost } = require('../controllers/projectController');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  });


//job management
router.post('/create', upload.single('file'), create);
router.get('/show/:id', project);
router.get('/all', getAll);
router.put('/edit/:id', edit);
router.delete('/delete/:id', deletePost);



module.exports= router;