//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://0.0.0.0:27017/auth1DB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.secret, encryptedFields: ['password'] });


const User = mongoose.model("User", userSchema);


app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/register", (req,res) => {
    res.render("register");
})

app.post("/register", (req,res) => {
    const user = new User ({
        email: req.body.username,
        password: req.body.password
    });

    User.findOne({email: req.body.username}).then((foundUser) => {
        if(foundUser) {
            res.redirect("/login");
        } else {
            user.save().then(() => {
                res.render("secrets");
            }).catch(err => {
                throw err;
            });
        }
    })

    
});

app.post("/login", (req,res) => {
    User.findOne({email: req.body.username}).then((foundUser) => {
        if(foundUser.password=== req.body.password) {
            res.render("secrets");
        } else {
            res.send("User Not Found, Plz Register First.")
        }
        
    }).catch(err => {
        throw err;
    });
});


app.listen(3000, () => {
    console.log("The localhost is running on port 3000");
});