const express=require('express');
const router =express.Router();
const recepies=require('../controllers/recepies');
const catchAsync=require('../utils/catchAsync');
const{isLoggedIn,isAuthor,validateRecepie}=require('../middleware');
const Recepie=require('../models/recepie');
const multer =require('multer');
const { storage}=require('../cloudinary/index');
const upload=multer({storage:storage});


router.route('/')
    .get(catchAsync(recepies.index))
    .post(isLoggedIn,upload.array('image'),validateRecepie,catchAsync(recepies.createRecepie))
   

router.get('/new', isLoggedIn, recepies.renderNewForm)

router.route('/:id')
    .get(catchAsync(recepies.showRecepie))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateRecepie, catchAsync(recepies.updateRecepie))
    .delete(isLoggedIn, isAuthor, catchAsync(recepies.deleteRecepie));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(recepies.renderEditForm))
router.post('/search',recepies.searchRecepie);


module.exports = router;