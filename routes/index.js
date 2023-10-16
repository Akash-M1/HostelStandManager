const express=require('express');
const StandController = require("../controller/hostelStand");
const passport = require('passport');
const router=express.Router();


router.get('/',passport.checkAuthentication,StandController.getStandManager);
router.use('/stand',require('./stand'));
router.use('/user',require('./user'));

module.exports=router;