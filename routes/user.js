const express=require('express');
const UserController = require("../controller/user");
const passport = require('passport');
const router=express.Router();


router.get('/sign-in',passport.signInSignUpAuthentication,UserController.getSignInPage);
router.get('/sign-up',passport.signInSignUpAuthentication,UserController.getSignUpPage);
router.post('/create-user',UserController.createUser);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/user/sign-in'}
),UserController.createSession);
router.get('/sign-out',UserController.destroySession);

module.exports=router;