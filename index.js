var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var promise = require('promise');
var path = __dirname + '/views/';
var helpers = require('./helpers/dbHelper');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8686;

var router = express.Router();

router.use((req, res, next) => {
    console.log(req.method);
    next();
});

router.get("/authuser", (req, res) => {
    console.log(path + "login-register.html");
    res.sendFile(path + "login-register.html");
});
var user;

router.get('/home', (req, res) => {
    console.log(req.query.user);
    user = req.query.user;
    console.log("welcome to homepage");
    res.sendFile(path + "home.html");
});

router.get('/fetch', (req, res) => {
    var obj = {};
    var list;
    console.log(user);
    helpers.fetchPopularMovies().then((result) => {
        list = result;
        console.log("movieList: " + list);
        res.send(list);
    });
});

router.get('/search', (req, res) => {
    var obj = {};
    var movieList;
    obj = req.query.param;
    console.log('searchparam: ' + obj);

    helpers.searchMovie(obj).then((result) => {
        movieList = result;
        console.log("search: " + movieList);
        res.send(movieList);
    });
});

router.post('/register', (req, res) => {
    var name = req.body.regName;
    var email = req.body.regEmail;
    var pass = req.body.regPass;
    var confPass = req.body.regConfPass;

    if (name == "" || email == "" || pass == "" || confPass == "") {
        //alert("Please enter the details");
    } else {
        helpers.registerUser(name, email, pass, confPass).then((result) => {
            console.log(result);
            res.redirect('../home?user='+email);
        }).catch((err) => {
            console.log(err);
        });
    }
});

router.post('/login', (req, res) => {
    var email = req.body.loginEmail;
    var pass = req.body.loginPassword;
    console.log('login: ' + email + ' ' + pass);
    if (email == "" || pass == "") {
        res.redirect('../authuser');
    } else if (email != "" && pass != "") {
        helpers.loginUser(email, pass).then(() => {
            res.redirect('../home?user='+email);
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('../authuser');
    }
});

router.post('/logout', (req, res) => {
    res.redirect('../authuser');
})

router.get('/like', (req, res) => {
    var obj1;
    var obj2;
    obj1 = user;
    obj2 = req.query.param1;
    console.log('like data ' + obj1 + ' ' + obj2);

    helpers.like(obj1, obj2).then((result) => {
        console.log(result);
    })
})

router.get('/dislike', (req, res) => {
    var obj1;
    var obj2;
    obj1 = user;
    obj2 = req.query.param1;

    console.log('like data ' + obj1 + ' ' + obj2);

    helpers.dislike(obj1, obj2).then((result) => {
        console.log(result);
    });
});

router.get('/fetchLiked', (req, res)=>{
    var userID = user;
    var likesMovies;
    helpers.fetchLiked(userID).then((result)=>{
        likesMovies = JSON.stringify(result);
        console.log('fetchliked: '+likesMovies);
        res.send(likesMovies);
    })
})

router.get('/fetchDisliked', (req, res)=>{
    var userID = user;
    var dislikesMovies;
    helpers.fetchDisLiked(userID).then((result)=>{
        dislikesMovies = JSON.stringify(result);
        console.log('fetchliked: '+dislikesMovies);
        res.send(dislikesMovies);
    })
})

app.use('/', router);

app.listen(port);
console.log('Server running at port ' + port);