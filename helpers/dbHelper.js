var helpers = {};
var db = require('./db');

helpers.registerUser=(name, email, pass, confPass)=>{

    return new Promise( (resolve, reject)=>{
        
        console.log("Database is connected ... nn");
        console.log(name+' '+email+' '+pass+' '+confPass);

        var user = {
            "name":name,
            "email":email,
            "password":pass
        }

        db.query('INSERT into userRegistration SET ?', user, (error, results, fields)=>{
            if(error){
                console.log("error occured");
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

helpers.loginUser = (email, password) => {
    return new Promise( (resolve, reject) => {
        
        db.query('SELECT * from userRegistration where email = ?',email, (error, result, fields)=>{
            if(error){
                console.log(error);
                reject(error);
            }else{
                console.log('solution of select query: ', result);
                if(result.length>0){
                    if([0].password == password){
                        resolve("success");
                    }else{
                        resolve('email and password do not match');
                    }
                }
            }
        })
    })
}

module.exports = helpers;