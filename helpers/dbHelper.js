var helpers = {};
var db = require('./db');
var http = require("https");

helpers.registerUser = (name, email, pass, confPass) => {

    return new Promise((resolve, reject) => {

        console.log("Database is connected ... nn");
        console.log(name + ' ' + email + ' ' + pass + ' ' + confPass);

        var user = {
            "name": name,
            "email": email,
            "password": pass
        }

        db.query('INSERT into userRegistration SET ?', user, (error, results, fields) => {
            if (error) {
                console.log("error occured");
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

helpers.loginUser = (email, password) => {
    return new Promise((resolve, reject) => {

        db.query('SELECT * from userRegistration where email = ?', email, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('solution of select query: ', result);
                if (result.length > 0) {
                    if ([0].password == password) {
                        resolve("success");
                    } else {
                        resolve('email and password do not match');
                    }
                }
            }
        })
    })
}

helpers.fetchPopularMovies = () => {
    return new Promise((resolve, reject) => {
        console.log("fetching movies");
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/3/movie/top_rated?page=1&language=en-US&api_key=8e1388ceecf3090f0ae4488199df1d8a",
            "headers": {}
        };
        var body = null;
        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                body = Buffer.concat(chunks);
                console.log('body: ' + body);
                resolve(body);
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        req.write("{}");
        req.end();
    }).catch((error) => {
        assert.isNotOk(error,'Promise error');
      });;
}

module.exports = helpers;