const Register = require('../model/register');

exports.getSignInPage = (req,res)=>{
    return res.render('sign-in',{
        title:"Sign-in Page"
    });
}

exports.getSignUpPage = (req,res)=>{
    return res.render('sign-up',{
        title:"Sign-up Page"
    });
}

exports.createUser = async (req,res)=>{
    const existUser = await Register.find({'email':req.body.email});
    if(existUser.length!=0){
        return res.redirect('/user/sign-in');
    }
    else{
        const newUser = await Register.create(req.body);
        return res.redirect('/user/sign-in');
    }
}

exports.createSession = (req,res)=>{
    return res.redirect('/');
}

exports.destroySession=(req,res)=>{
    req.logout(function(err){
        if (err) {
                return next(err); 
        }
    });
    return res.redirect('/user/sign-in');
}