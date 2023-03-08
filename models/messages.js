const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    room:{
        type:String,
        required:true
    },
    messages:[String],
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports =mongoose.model('Message',messageSchema)