const { User } = require('./../models/user');

let auth = (req, res, next) => {
    //Grab token
    let token = req.cookies.w_auth;
    //Find Token
    User.findByToken(token, (err, user)=> {
        //If error or not authenticated------- 
        if(err) throw err;
        if (!user) return res.json({
            isAuth: false,
            error: true
        });
        //Else if valid token run this----
        req.token = token;
        req.user = user;
        next();
    })
}


module.exports ={ auth }