const express = require('express');
const cors = require('cors');

const app = express();

const http = require('http');
const { Server } = require("socket.io");
const userController = require('./controllers/userController');
const { mongooseConnect } = require('./db');
const messageController = require('./controllers/messageController');


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

const server = http.createServer(app);

// mongooseConnect.then(res =>{
//     console.log('DB connected Successfully')
// }).catch(err =>{
//     console.log(err)
// })

const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
    },
});

let users =[]

io.use((socket,next)=>{ 
    let userName = socket.handshake.auth.name;
    let userId = socket.id;
    next();
})

io.on('connection', (socket) => {
    let currentUser ={
        id:socket.id,
        name:socket.handshake.auth.name
    }
    users.push(currentUser)
    

    socket.on('join', (data) => {

        socket.join(data.room);
        
        const user ={
            name:socket.handshake.auth.name,
            room:data.room
        }
        
        userController.newUser(user,socket.handshake.auth.name)

        console.log(data.name + ' joined ' + data.room);

        socket.emit('new-user',{
            id:socket.id,
            name:socket.handshake.auth.name
        })

        io.emit('users',users)

        socket.broadcast.to(data.room).emit('join-message', `${data.name} joined the ${data.room}`)

    });
    socket.on('new-msg', async (data) => {
        console.log(data.name + ' sent ' + data.message); 
        const message = `${socket.handshake.auth.name}:${data.message}`;
        //messageController.getUserId(data.name , message);
        // const messages = await messageController.getMessages(socket.handshake.auth.name).then(data=>{
        //     return data
        // });
        // console.log(messages.messages)
        socket.broadcast.to(data.id).emit('show-msg', `${socket.handshake.auth.name}:${data.message}`)
    })
    socket.on('leave', (data) => {
        socket.emit('leave-msg', `${data.name} left the room`);
        users =users.filter(e => e.id !== data.id);
        io.emit('users',users)
    })
    socket.on('disconnect', (data) => {
        console.log('Disconnected');
        users =[]
    });
})

const PORT = process.env.PORT || 3000;



server.listen('3000', () => {
    console.log('listening to localhost:3000')
})