import express from 'express'
import mongoose from 'mongoose'
import Videos from './dbmodel.js'
import Cors from 'cors'

//app config
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://ricky6791:vanessa1@cluster0.q10bckd.mongodb.net/shortVideoDB?retryWrites=true&w=majority'



//middlewares
app.use(express.json())
app.use(Cors())

//DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//api endpoints
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

app.get('/v2/posts', (req, res) => {
    Videos.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

//listener
app.listen(port, () => console.log(`listening on localhost: ${port}`))