const express = require('express');
const router = express.Router();
const cafes = require('../controller/cafes');
const { storage }  = require('../cloudinary')

const multer = require('multer');
const upload = multer({ storage:storage});

const {isLoggedIn} = require('../controller/middleware')
// /cafe로 시작하는 주소


router.route('/')
    .get(cafes.showCafes)
    .post(upload.fields([{name:'photos'}, {name:'repreMenuPhoto'},{name:'menuPhoto'}]), cafes.creatCafe)
    
router.route('/:id')
    .delete(isLoggedIn, cafes.deleteCafe)
    
router.route('/api/:id')
    .get(cafes.cafeDataApi)

router.route('/api/totalRating/:id')
    .get(cafes.ratingApi)

router.route('/create')
    .get(isLoggedIn, cafes.sendCreateCafe)

router.route('/user/review/:id')
    .delete(isLoggedIn, cafes.deleteReview)
    .post(upload.single('photos'), cafes.createReview)

router.route('/edit/:id')
    .get(cafes.editCafePage)
    .post(cafes.editCafe);

router.route('/filter')
    .get(cafes.filteredCafe)
    
module.exports = router;