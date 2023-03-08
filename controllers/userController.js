const User =require('../models/user');

const createUser =(user,name)=>{
    console.log(name)
    User.findOne({name:name,room:user.room}).then(res =>{
        if(!res){
            User.create(user).then(res =>{
                console.log(res)
            }).catch(err =>{
                console.log(err)
            })
        }
    }).catch(err =>{
        console.log(err)
    })
}

const getUser = ()=>{
    const users =[]
    User.find(async(err,data)=>{
        if(err){
            console.log(err)
        }else{
            users.push(...data)
        }
    })
    console.log(users)
}

module.exports ={
    newUser:createUser
}