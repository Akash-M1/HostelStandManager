const Users=require('../model/users');

exports.getStandManager =(req,res)=>{
    return res.render('index',{
        "title":"Home-Page"
    });
}

exports.createUser =async (req,res)=>{
    if(req.xhr){
        const data=req.body;
        try {
            if(await checkOverlap(data)){
                return res.status(200).json({
                    message:"Error!! Time Overlap Occured Please Choose Different Time"
                });
            }
            else{
                const udata = await Users.create(data);
                return res.status(200).json(udata);
            }
        } catch (error) {
            console.log("Error occured while creating",error);
            return res.status(404).json({
                message:"Error Occured"
            });
        }
    }
    return res.redirect('back');
}

async function checkOverlap(presentBody){
    try {
        const allData = await Users.find();
        const toTime = new Date(presentBody.to).getTime();
        const fromTime = new Date(presentBody.from).getTime();
        const newData = allData.filter((val)=>{
            if(toTime > new Date(val.from).getTime() && fromTime<new Date(val.from).getTime()){
                return true;
            }
            else if(fromTime>=new Date(val.from).getTime() && toTime<=new Date(val.to).getTime()){
                return true;
            }
            else if(fromTime<new Date(val.to).getTime() && new Date(val.to).getTime()<toTime){
                return true;
            }
        });
        if(newData.length>0){
            return true;
        }
        else{
            return false;
        }
        
    } catch (error) {
        console.log("Error occured while Fetching",error);
    }
}

exports.getUsers = async (req,res)=>{
    if(req.xhr){
        try {
            const allData = await Users.find();
            return res.status(200).json(allData);
        } catch (error) {
            console.log("Error occured while Fetching",error);
            return res.status(404).json({
                message:"Error Occured"
            });
        }
    }
    return res.redirect('back');
}


exports.getCurrent =async (req,res)=>{
    if(req.xhr){
        try {
            const allData = await Users.find({currentUser:true});
            return res.status(200).json(allData);
        } catch (error) {
            console.log("Error occured while Fetching",error);
            return res.status(404).json({
                message:"Error Occured"
            });
        }
    }
    return res.redirect('back');
}

exports.deleteUser=async (req,res)=>{
    if(req.xhr){
        try {
            const delData = await Users.findByIdAndDelete(req.body.id);
            return res.status(200).json(delData);
        } catch (error) {
            console.log("Error occured while Deleting",error);
            return res.status(404).json({
                message:"Error Occured"
            });
        }
    }
}