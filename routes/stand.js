const express=require('express');
const StandController = require("../controller/hostelStand");
const router=express.Router();

router.post('/create-user',StandController.createUser);
router.get('/get-users',StandController.getUsers);
router.get('/get-current',StandController.getCurrent);
router.delete('/delete-user',StandController.deleteUser);

module.exports=router;