var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var promise = require('promise');
var path = __dirname + '/views/';

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

app.use('/', router);

app.listen(port);
console.log('Server running at port '+port);