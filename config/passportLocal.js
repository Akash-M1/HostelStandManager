const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Register = require('../model/register');

passport.use(new LocalStrategy(
    {
        usernameField:'email',
        passReqToCallback:true
    },
    async function(req,email,password,done){
        try {
            const User = await Register.findOne({email:email});
            if(User.password==password){
                return done(null,User);
            }
            else{
                return done(null,false);
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser (function(user,done){
    return done(null,user.id);
})

passport.deserializeUser (async function(id,done){
    try{
        const user = await Register.findById(id);
        if(!user){
            return done(null,false);
        }
        else{
            return done(null, user);
        }
    }
    catch(err){
        return done(err)
    }
})

passport.checkAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user = req.user; 
    }
    return next();
}

passport.signInSignUpAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return next();
}

module.exports = passport;