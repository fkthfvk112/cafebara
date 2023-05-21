const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const {isLoggedIn} = require('../controller/middleware')
const passport = require('passport');

router.route('/')
    .get(isLoggedIn, users.user);

router.route('/signup')
    .get(users.sendSignUp)
    .post(users.signUp)

router.route('/signup/idValidationCheck')
    .post(users.isValideId)

router.route('/signup/isValideNickname')
    .post(users.isValideNickname);

router.route('/signin')
    .get(users.sendSignIn)
    .post(passport.authenticate('local', 
    {falureFlash: true,
    keepSessionInfo: true, failureRedirect: '/user/signin', 
    failureFlash: '잘못된 아이디 또는 비밀번호입니다.'}),
    users.signIn)

router.route('/logout')
    .get(users.logOut)

router.route('/api/islogIn')
    .get(users.isLogInAPI)

router.route('/deleteId')
    .post(isLoggedIn, users.deleteId)

router.route('/like/:id')
    .get(users.likeCafe)

router.route('/checkLike/:id')
    .get(users.checkLike)
    
module.exports = router;