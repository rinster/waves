const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
})


//REGISTER - On every 'save', run this function prior to saving the user to DB
userSchema.pre('save', async function(next){

    if(!this.isModified("password")) {
        next()
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, salt)
            
            this.password = hash
            next()
        } catch(err) {
            next(err)
        }
    }
    //ES5 Function Version
    // var user = this;
    
    // if(user.isModified('password)) {
    // bcrypt.genSalt(SALT_I, function(err, salt){
    //     if (err) return next(err); //if err kill the continue fwd
    //     //else, hash password
    //     bcrypt.hash(user.password,salt,function(err, hash){
    //         if(err) return next(err);
    //         user.password = hash;
    //         next();
    //     });
    // })
    //} else {
   //     next();
   // }
})

//LOGIN - Compare User password to hashed password
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err); //if password does not match
        cb(null, isMatch) //if password matches

       
        
    })
}

//LOGIN - Generate Token
userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.SECRET)
    user.token = token; 
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

//AUTHENTICATE - Find Token
userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    //Decode JWToken to validate the user
    //takes token and password as arguments, returns an ID
    jwt.verify(token, process.env.SECRET, function(err, decode) {
        user.findOne({"_id":decode, "token":token}, function (err, user){
            if (err) return cb(err);
            cb(null, user);
        })
    })
};


//Export Models
const User = mongoose.model('User', userSchema);
module.exports = { User }