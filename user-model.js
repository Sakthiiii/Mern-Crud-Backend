const mongoose = require('mongoose')
const User = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    age:{
        type:String
    },
    img:{
        type:String,
    }
})

//module.exports = User

module.exports= mongoose.model('user',User )