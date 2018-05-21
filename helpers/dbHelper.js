var helpers = {};
var db = require('./db');
var http = require("https");

helpers.registerUser = (name, email, pass, confPass) => {

    return new Promise((resolve, reject) => {
        console.log("Database is connected ... nn");
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
                resolve(body);
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        req.write("{}");
        req.end();
    }).catch((error) => {
        assert.isNotOk(error, 'Promise error');
    });
}

helpers.searchMovie = (movieParam) => {
    return new Promise((resolve, reject) => {
        var final = movieParam.replace(/ /g, "%20");
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/3/search/movie?page=1&query=" + final + "&language=en-US&api_key=8e1388ceecf3090f0ae4488199df1d8a",
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
                resolve(body);
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        req.write("{}");
        req.end();
    }).catch((error) => {
        assert.isNotOk(error, 'Promise error');
    });
}

helpers.like = (userid, moviename, vote) => {
    return new Promise((resolve, reject) => {

        console.log()
        var user = {
            "userid": userid,
            "moviename": moviename,
            "likes": 1,
            "votes": vote
        }

        db.query('INSERT into userLike SET ?', user, (error, results, fields) => {
            if (error) {
                console.log("line 145 insert error occured");
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

helpers.dislike = (userid, moviename, vote) => {
    return new Promise((resolve, reject) => {

        var user = {
            "userid": userid,
            "moviename": moviename,
            "dislike": 1,
            "votes": vote
        }

        db.query('INSERT into userLike SET ?', user, (error, results, fields) => {
            if (error) {
                console.log("error occured");
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

helpers.fetchLiked = (userid) => {
    return new Promise((resolve, reject) => {

        db.query('SELECT * from userLike where userid = ? and likes = 1', userid, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

helpers.fetchDisLiked = (userid) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from userLike where userid = ? and dislike = 1', userid, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

helpers.sortLike = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from userLike where likes = 1 order by votes desc', (error, result, fields)=> {
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
}

helpers.sortDislike = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from userLike where dislike = 1 order by votes desc', (error, result, fields)=> {
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
}

helpers.sortList = () => {
    return new Promise((resolve, reject) => {
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/3/movie/popular?page=1&language=en-US&api_key=8e1388ceecf3090f0ae4488199df1d8a",
            "headers": {}
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                resolve(body);
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        req.write("{}");
        req.end();
    }).catch((error) => {
        assert.isNotOk(error, 'Promise error');
    });
};

module.exports = helpers;