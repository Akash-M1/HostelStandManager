const express= require('express');
const path=require('path');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('./config/mongoose');

const app=express();
const PORT=3344;

app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));


app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('./assets'));

app.use('/',require('./routes'));

app.listen(PORT,()=>{
    console.log("Listening on",PORT);
});