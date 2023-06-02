//jshint esversion:6
require('dotenv').config() ///Environment Variable & Taruh Paling Atas///
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); /////////level 2 encryption//////////
 
const app = express();
 
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));
 

// mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema ({ /////////level 2 encryption//////////
    email: String,
    password: String
})

/////////level 2 encryption//////////

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
secret: process.env.SECRET //environmen variable
/////////level 2 encryption//////////

const User = new mongoose.model('User', userSchema)

app.get('/', function(req, res) {
    res.render('home')
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.get('/register', function(req, res) {
    res.render('register')
})

app.post("/register", (req, res)=>{
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
  });

app.post("/login", (req, res)=>{

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then((foundUser)=>{
        if (foundUser.password === password) {
                res.render("secrets");
        }
    }).catch((err)=>{
        console.log(err);
    })
  });



// app.post('/login', (req, res) => {

//         const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}, (err, foundUser) => {
//         if(err){
//             console.log(err);
//         }else{
//             if(foundUser){
//                 if(foundUser.password === password){
//                     res.render('secrets');
//                 }
//             }
//         }
//     });
// });

app.listen(3000, function() {
    console.log('server running on port 3000')
})