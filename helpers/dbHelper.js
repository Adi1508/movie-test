var helpers = {};

helpers.registerUser=(name, email, pass, confPass)=>{
    return new Promise( (resolve, reject)=>{
        console.log(name+' '+email+' '+pass+' '+confPass);
        resolve({message:"register"});
    });
}

module.exports = helpers;