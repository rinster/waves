const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const formidable = require('express-formidable');//handle file requests
const cloudinary = require('cloudinary');

const app = express();
const async = require('async');

// ===============================
//          Mongoose 
//================================
const mongoose = require('mongoose');
require('dotenv').config(); //Access .env file 
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE) //Grab mongoDB path from .env

// ===============================
//          Models
//================================
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');
const { Payment } = require('./models/payment');
const { Site } = require('./models/site');



// ===============================
//          Middleware
//================================
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// ===============================
//       Cloudinary Config
//================================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// ===============================
// **Enable Cross Domain Script**
//  This allows for the server and
//  the client server to run 
// concurrently and allows cross 
// doman scripting
//================================
// // ///FUNCTION --- All Cross Domain Origins
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
 
    next();
});

// ===============================
//          Products
//================================


//POST ----- Add new Product
app.post('/api/product/article', auth, admin, (req,res)=>{
    const product = new Product(req.body);
    product.save((err, doc)=> {
        if(err) return res.json({success: false, err});
        res.status(200).json({
            success: true,
            article: doc
        })
    })
});
//GET ----- Product or Products by ID
app.get('/api/product/articles_by_id', (req,res)=>{
    let type = req.query.type;
    let items = req.query.id;

    if(type === "array") { //If product search is more than 1 item
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map(item =>{
            return mongoose.Types.ObjectId(item)
        })
    }
    Product.
    find({ '_id':{$in:items} }).
    populate('brand').//populate this portion of the get with the reference 
    populate('wood').
    exec((err, docs)=>{
        return res.status(200).send(docs)
    }) 
});

//GET ----- Get all products by filters
app.post('/api/product/shop', (req,res)=> {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === 'price'){
                //handle prices------------------
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                //handle everything else---------
                findArgs[key] =req.body.filters[key]
            }
        }
    }

    //If product property 'publish' is false
    //the server will not publish/push that item to client
    //because of the line below
    findArgs['publish'] = true;

    Product.
    find(findArgs).
    populate('brand').
    populate('wood').
    sort([[sortBy,order]]).
    skip(skip).
    limit(limit).
    exec((err, articles)=>{
        if (err) return res.status(400).send(err);
        res.status(200).json({
            size: articles.length,
            articles
        })
    })

    res.status(200)
});

//GET ----- Sort by Arrival
// //articles?sortBy=createdAt&order=desc&limit=4

//GET ----- Sort by Sell
// //articles?sortBy=sold&order=desc&limit=100



app.get('/api/product/articles', (req,res)=>{
    //Ternaries to if order/sort/limit exists
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Product.
    find().
    populate('brand').
    populate('wood').
    sort([[sortBy,order]]).
    limit(limit).
    exec((err, articles)=>{
        if(err) return res.status(400).send(err);
        res.send(articles)
    })
});

//GET ----- Sort by Amount Sold
// //articles?sortBy=sold&order=descen&limit=4


// ===============================
//          WOODS
//================================
app.post('/api/product/wood',auth, admin, (req,res)=>{
    const wood = new Wood(req.body);
    wood.save((err, doc)=>{
        if(err) return res.json({success: false, err});
        res.status(200).json({
            success: true, 
            wood: doc
        })
    })
});

app.get('/api/product/get_woods', (req,res)=> {
    Wood.find({}, (err, woods)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(woods)
    })
});


// ===============================
//          BRANDS
//================================
app.post('/api/product/brand', auth, admin, (req,res)=> {
    const brand = new Brand(req.body);
    brand.save((err,doc)=> {
        if(err) return res.json({success:false, err});
        res.status(200).json({
            success: true,
            brand: doc
        })
    })
});


app.get('/api/product/get_brands', (req,res)=> {
    Brand.find({}, (err, brands)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(brands);
    })
});

// ===============================
//          USERS
//================================
//This function validates if user is authenticated
app.get('/api/users/auth', auth, (req, res)=> {
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true, //check if user is an admin
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })
});

app.post('/api/users/register', (req, res)=> {
    const user = new User(req.body);
    user.save((err, doc)=> {
        if (err) return req.json({success: false, err})
        res.status(200).json({
            success: true,
            userdata: doc.name
        })
    })
});

app.post('/api/users/login', (req, res)=> {
    
    User.findOne({email: req.body.email}, (err, user)=> {
        if(!user) return res.json({loginSuccess: false, message: 'Authorization failed. User not found.'})
        
        user.comparePassword(req.body.password, (err, isMatch)=> {
            if(!isMatch) return res.json({loginSuccess:false, message: "Wrong password"})
            
             //Generating token
             user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess:true
                })
             })
        })
    })
});

app.get('/api/users/logout', auth, (req,res)=>{
    //Find user and destroy token
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: '' },
        (err, doc) => {
            if(err) return res.json({success: false, err})
            return res.status(200).send({
                success:true,

            })
        }
    )
});

//POST -----  Upload Images to Cloudinary
app.post('/api/users/uploadimage',auth,admin, formidable(),(req,res)=>{
    cloudinary.uploader.upload(req.files.file.path, (result)=> {
        console.log(result);
        res.status(200).send({
            public_id: result.public_id,
            url: result.url
        })
    },{
        public_id: `${Date.now()}`,//name of the image
        resource_type: 'auto'//type of file upload
    })
});

//GET -----  Remove Images from Cloudinary
app.get('/api/users/removeimage', auth,admin,(req,res)=> {
    let image_id = req.query.public_id;
    cloudinary.uploader.destroy(image_id, (error, result)=>{
        if(error) return res.json({success:false, error});
        res.status(200).send('ok');
    })
});

//POST ----- Add items to cart
app.post('/api/users/addToCart',auth,(req,res)=>{
    User.findOne({_id: req.user._id},(err,doc)=> {
        
        //Check for duplicates to modify qty in cart
        let duplicate = false;
        doc.cart.forEach((item)=> {
            if(item.id == req.query.productId){
                duplicate = true;
            }
        })
        if(duplicate){
                //If duplicate item, find user cart by id and update the quantity type on duplicate item - increment by 1
                User.findOneAndUpdate({_id: req.user._id, "cart.id": mongoose.Types.ObjectId(req.query.productId)},
                { $inc: {"cart.$.quantity":1} },
                { new:true },
                ()=> {
                    if(err) return res.json({success:false, err})
                    // if no err return contents of cart
                    res.status(200).json(doc.cart)                    
                }
            )
        }else{
            User.findOneAndUpdate(
                {_id: req.user._id},
                {$push: {cart:{
                    id: mongoose.Types.ObjectId(req.query.productId),
                    quantity: 1,
                    date: Date.now()

                }}},
                {new: true},//Get docs back
                (err,doc)=> {
                    if(err) return res.json({success:false, err})
                    // if no err return contents of cart
                    res.status(200).json(doc.cart)
                }
            )
        }
    })
})

//DELETE - Remove item from Cart
app.get('/api/users/removeFromCart', auth,(req, res)=> {

    User.findOneAndUpdate(
        {_id: req.user.id},
        //Pull the info you want to remove, specify by id
        {"$pull":
            {"cart": {"id": mongoose.Types.ObjectId(req.query._id)}}
        },
        //Have the server return the updated cart info "{ new: true }"
        { new: true },
        (err,doc)=> {
            let cart = doc.cart;
            let array = cart.map(item=> {
                return mongoose.Types.ObjectId(item.id)
            });

            Product.
            find({'_id':{ $in: array }}).//find all elems with id that matches elem in array
            populate('brand').
            populate('wood').
            exec((err, cartDetail)=> {
                return res.status(200).json({
                    cartDetail,
                    cart
                })
            })
        }
    )
})

//POST - Store previous purchases in user history and 
//------clear cart items on purchase success
app.post('/api/users/successBuy', auth, (req,res)=>{
    let history = [];
    let transactionData = {}; //data from Paypal

    //1. Store purchase to user history
    req.body.cartDetail.forEach((item)=>{
        history.push({
            dateOfPurchase: Date.now(),
            name: item.name,
            brand: item.brand,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })
    //2. Store Payments for Admin Dash
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData;
    transactionData.product = history
    
    //3. Update user hx and clear cart
    User.findOneAndUpdate(
        {_id:req.user._id},
        { $push: { history:history }, $set:{ cart:[] } }, //push hx and reset cart to empty array
        { new:true }, //get updated doc of user
        (err,user)=>{
            if(err) return res.json({success:false, err});

    //4. Store payment to payment models
            const payment = new Payment(transactionData);
            payment.save((err,doc)=> {
                if(err) return res.json({success:false,err});
                let products = [];
                doc.product.forEach(item=> {
                    products.push({id: item.id, quantity: item.quantity})
                })

    //5. Update quantity sold for each item bought
                async.eachSeries(products,(item,callback)=> {
                    //update - on each product update quantity sold
                    Product.update(
                        {_id:item.id},
                        { $inc: {
                            "sold":item.quantity
                        }},
                        { new:false },
                        callback //trigger callback below once commands above are done
                    )
                },(err)=>{
                    if(err) return res.json({success:false, err})
                    res.status(200).json({
                        success:true,
                        cart: user.cart,
                        cartDetail:[] //send to update state on redux
                    })
                })
            });
        }
    )
});

//POST -  Update personal information
app.post('/api/users/update_profile', auth, (req,res)=> {

    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$set": req.body 
        },
        { new: true },
        (err, doc)=> {
            if (err) return res.json({success: false, err});
            return res.status(200).send(
                { success:true }
            )
        }
    )

});

// ===============================
//          Site
//================================

app.get('/api/site/site_data', (req,res)=>{
    Site.find({}, (err, site)=> {
        if(err) return res.status(400).send(err);
        res.status(200).send(site[0].siteInfo)
    });
});

app.post('/api/site/site_data', auth, admin, (req,res)=>{
    Site.findOneAndUpdate(
        { name: 'Site' },
        { "$set": { siteInfo: req.body }},
        {new: true},
        (err,doc)=> {
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true,
                siteInfo: doc.siteInfo
            })
        }
    )
})

// ===============================
//          Port
//================================
const port = process.env.PORT || 3002;
app.listen(port, () =>{
    console.log(`Server Running at ${port}`)
});