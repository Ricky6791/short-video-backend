import express from 'express'
import mongoose from 'mongoose'
import Videos from './dbmodel.js'
import Cors from 'cors'
import User from './Users.js';

import bodypasrser from 'body-parser';
import passport from 'passport';
import jwt from 'jsonwebtoken';


//app config
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://ricky6791:vanessa1@cluster0.q10bckd.mongodb.net/shortVideoDB?retryWrites=true&w=majority'



//middlewares
app.use(express.json())
app.use(Cors())
app.use(bodypasrser.json());
app.use(bodypasrser.urlencoded({extended: false}));
app.use(passport.initialize());


//DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//api endpoints
app.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

app.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

app.get('/', (req, res) => res.status(200).send('hello world'))

app.post('/v2/posts', async(req, res) => {
    try{
        const newVideo = new Videos(req.body)
        const savedVideo = await newVideo.save()
        res.status(201).send(savedVideo)
    }catch(err){
        res.status(500).send(err)
    }
})

app.get('/v2/posts', async(req, res) => {
    try{
        const data = await Videos.find()
        res.status(200).send(data)
    }catch (error) {
        res.status(500).send(error)
    }
})

//listener
app.listen(port, () => console.log(`listening on localhost: ${port}`))