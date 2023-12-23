const express = require('express');
const app = express();
const socketio = require('socket.io')
const namespaces = require('./data/namespaces');
const Room = require('./classes/Room')

app.use(express.static(__dirname + '/public'));
 
const expressServer = app.listen(9000)
const io = socketio(expressServer)


//manufactured way to change an ns (without building a huge UI)
app.get('/change-ns', (req, res)=> {
    //update namespaces array
    namespaces[0].addRoom(new Room(0, 'Deleted Articles', 0))
    //let everyone know in this namespace, that it changed
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0])
    res.json(namespaces[0])
})

io.on('connection', (socket) => {
    socket.emit('welcome', "Welcome to the server.")
    socket.on('clientConnect', (data)=> {
        console.log(socket.id,"has connected") 
        socket.emit('nsList', namespaces)
    })
})  


namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', (socket) => {
        //console.log(`${socket.id} has connected to ${namespace.endpoint}`)
        socket.on('joinRoom', async(roomTitle, ackCallBack) => {
            //fetch the history
            console.log(roomTitle)
            const rooms = socket.rooms
            
            let i = 0
            rooms.forEach(room => {
                if(i!== 0) {
                    socket.leave(room)
                }
                i++
            })

            //join the room
            //NOTE - roomTitle is coming from the client. Which is not safe
            //Auth to make sure the socket has right to be in that room
            socket.join(roomTitle)
            
            // fetch the number of sockets in this room
            const sockets = await io.of(namespace.endpoint).in(roomTitle).fetchSockets()

            const socketCount = sockets.length

            ackCallBack({numUsers: socketCount})
            //socket.emit('getHistoryAndNumUsers',{})

            socket.on('newMessageToRoom', (messageObj)=> {
                console.log(messageObj)

                //broadcast this to all the connected clients... this room only!
                //how can we find out what room this socket is in?
                const rooms = socket.rooms
                const currentRoom = [...rooms][1]

                //send out this messageObj to everyone including the sender
                io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', messageObj)
            })
        })
    })
})