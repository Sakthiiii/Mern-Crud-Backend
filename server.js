//require ('./db-connection')
require('dotenv').config();

const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5005
const userRouter = require('./routers/user-router')
const path = require('path');
const dotenv = require('dotenv'); 

const bodyParser = require('body-parser');
const connenctDB =require('./db-connection');
 dotenv.config({path:'config.env'});
app.use(cors())
app.use(express.json())
app.use(bodyParser.json()); // to support JSON-encoded bodies

//app.use(express.urlencoded())
app.use('/public', express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.resolve(__dirname, './build')));
connenctDB();


app.use('/api/users',userRouter)

app.use((err,req,res,next)=>{
    res.status(500).json({'msg':err})
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server Running `)})


