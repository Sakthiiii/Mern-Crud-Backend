const mongoose = require('mongoose')
const User = mongoose.model('User', {
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

module.exports = User