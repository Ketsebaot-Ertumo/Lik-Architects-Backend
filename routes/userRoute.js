const express = require('express');
const { showProfile, showUsers, aUser, update, deleteUser, share, getRoleTypes } = require('../controllers/userController');
const router = express.Router();


     
router.get('/show', showProfile);
router.get('/all', showUsers);
router.get('/show/:id', aUser);
router.put('/edit/:id', update);
router.delete('/delete/:id', deleteUser)
router.post('/share', share)
router.get('/roleList', getRoleTypes)



module.exports= router;

