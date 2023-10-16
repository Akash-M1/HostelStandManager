const express= require('express');
const path=require('path');
const dotenv=require('dotenv').config();
const passportLocalStrategy = require('./config/passportLocal');
const passport = require('passport');

const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('./config/mongoose');

const sessions = require('express-session');
const MongoStoreDB = require('connect-mongodb-session')(sessions);
const cookieParser = require('cookie-parser');


const app=express();
const PORT=3344;

const store = new MongoStoreDB({
    uri:process.env.Mongoose_URL,
    collection:"MySessions"
});

store.on('error',(err)=>{
    console.log('Error using mongo store');
});

app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('./assets'));

app.use(sessions({
    name:"Charitable",
    secret:"HelloBlahBlah",
    cookie:{
        maxAge:(1000*24*60*60)
    },
    resave:false,
    saveUninitialized:false,
    store:store
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(cookieParser());

app.use('/',require('./routes'));

app.listen(PORT,()=>{
    console.log("Listening on",PORT);
});