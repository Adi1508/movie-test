var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var promise = require('promise');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8686;

var router = express.Router();

router.use((req, res, next)=>{
    console.log('website is up..');
    next();
});

router.route('/home')
    .get((req, res)=>{
        res.json({message:"under construction"});
    });

app.use('/', router);

app.listen(port);
console.log('Server running at port '+port);