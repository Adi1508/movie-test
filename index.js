var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var promise = require('promise');
var path = __dirname + '/views/';
var helpers = require('./helpers/dbHelper');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8686;

var router = express.Router();

router.use((req, res, next)=>{
    console.log(req.method);
    next();
});

router.get("/authuser",(req, res)=>{
    console.log(path+"homepage.html");
    res.sendFile(path+"homepage.html");
});

router.get('/home', (req, res)=>{
    console.log("welcome to homepage");
})

router.post('/register', (req, res) => {
    var name = req.body.regName;
    var email = req.body.regEmail;
    var pass = req.body.regPass;
    var confPass = req.body.regConfPass;

    if(name==null || email==null || pass==null || confPass==null){
        alert("Please enter the details");
    }else{
        helpers.registerUser(name, email, pass, confPass).then(()=>{
            console.log("success");
            res.redirect('../home');
        }).catch((err)=>{
            console.log(err);
        });
    }
});

router.post('/login', (req, res)=>{
    var email = req.body.loginEmail;
    var pass = req.body.loginPassword;

    if(email==null || pass==null){
        alert("please fill the details to proceed");
    }else{
        helpers.loginUser(email, pass).then(()=>{

            res.redirect('../home');
        }).catch((err)=>{
            console.log(err);
        });
    }
});

app.use('/', router);

app.listen(port);
console.log('Server running at port '+port);