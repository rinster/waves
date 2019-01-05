//This middleware validates the role of the user

let admin = (req,res,next) => {
    if(req.user.role === 0 ) {
        return res.send('User does not have administration priviledges')
    }
    // //Potential Future Additional Levels of Admin
    // if(req.user.role === 1 && req === updatePost ) {
    //     return res.send('User not allowed into admin')
    // }
    next()
}

module.exports = { admin }