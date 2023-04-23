const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const {isLoggedIn} = require('../controller/middleware')
const passport = require('passport');



router.route('/signup')
    .get(users.sendSignUp)
    .post(isLoggedIn, users.signUp)

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

module.exports = router;