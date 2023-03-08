const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        min:3,
        required:true,
    },
    room:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('User',userSchema)