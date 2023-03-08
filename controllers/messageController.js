const User = require('../models/user');
const Message = require('../models/messages');
const { default: mongoose } = require('mongoose');
const messages = require('../models/messages');



const getUserId = (name,message)=>{
    let userId ='';
    let room='';
    User.findOne({name:name}).then(data =>{
        room = data.room,
        userId = data._id
        Message.findOne({userId:userId}).then(data =>{
            messageUser={
                room:room,
                messages:[message],
                userId:userId
            }
            if(!data){
                Message.create(messageUser).then(res =>{
                    console.log(res)
                }).catch(err =>{
                    console.log(err)
                })
            }else{
                messages.findOneAndUpdate({userId:userId},{$push:{
                    messages:message
                }}).then(res =>{
                    console.log(res)
                }).catch(err =>{
                    console.log(err)
                })
            }
        })
    })
}

const getMessages =  async(name)=>{
    let userId ='';
    let room='';
    const messages =  await  User.findOne({name:name}).then(async (data) =>{
        userId = data._id;
        room = data.room;
        let messages = await Message.findOne({userId:userId , room:room}).then(data =>{
            return data
        });
        return messages
    })
   return messages
}    

module.exports ={
    getUserId :getUserId,
    getMessages:getMessages
}