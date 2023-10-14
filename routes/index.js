const express=require('express');
const StandController = require("../controller/hostelStand");
const router=express.Router();


router.get('/',StandController.getStandManager);
router.use('/stand',require('./stand'));

module.exports=router;