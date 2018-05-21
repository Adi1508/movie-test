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
        var final = movieParam.replace(/ /g,"%20");
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/3/search/movie?page=1&query="+final+"&language=en-US&api_key=8e1388ceecf3090f0ae4488199df1d8a",
            "headers": {}
        };

        console.log(options);

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

helpers.like = (userid, moviename)=>{
    return new Promise((resolve, reject)=>{
        

        var count;
        var getlikes = {
            "userid":userid,
            "movie_name": moviename
        }

        db.query('SELECT likes from userLike where userid = ? and movie_name = ?', getlikes, (error, results, fields)=>{
            if (error) {
                console.log("error occured");
                reject(error);
            } else {
                count=result;
            }
        })

        count=count+1;

        var user = {
            "userid": userid,
            "movie_name": moviename,
            "likes": count
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

helpers.dislike = (userid, moviename)=>{
    return new Promise((resolve, reject)=>{
        var count;
        var getdislikes = {
            "userid":userid,
            "movie_name": moviename
        }

        db.query('SELECT dislike from userLike where userid = ? and movie_name = ?', getdislikes, (error, results, fields)=>{
            if (error) {
                console.log("error occured");
                reject(error);
            } else {
                count=result;
            }
        })

        count=count+1;

        var user = {
            "userid": userid,
            "movie_name": moviename,
            "dislike": count
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

helpers.fetchLiked = (userid)=>{
    return new Promise((resolve, reject)=>{

        db.query('SELECT * from userLike where userid = ? and likes IS NOT NULL', userid, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

helpers.fetchDisLiked=(userid)=>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT * from userLike where userid = ? and dislike IS NOT NULL', userid, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports = helpers;