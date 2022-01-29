require ('./db-connection')
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4444
const userRouter = require('./routers/user-router')
const path = require('path');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.use('/public', express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.resolve(__dirname, './build')));


app.use('/api/users',userRouter)

app.use((err,req,res,next)=>{
    res.status(500).json({'msg':err})
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)})


