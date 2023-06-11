// THIS IS THE BACKEND SERVER
// WILL MAINTAIN THE REALTIME CODES
// AMONG CONNECTED SOCKETS WITHIN A 
// GROUP DEFINED BY A GROUPID
// IT WILL TAKE SOCKET.IO REQUESTS FROM
// OUR FRONTEND APPLICATION

const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


app.get('/', (req, res) => {
    res.send("text")
})


io.on('connection', (socket) => {
    console.log("someone joined");
    socket.on('joinning', (groupid) => {
        const groupSockets = io.sockets.adapter.rooms.get(groupid);
        if (groupSockets) {
            const socketsArray = Array.from(groupSockets);
            const randomSocket = socketsArray[Math.floor(Math.random() * socketsArray.length)];
            socket.join(groupid)
            socket.groupid = groupid
            console.log("here", socketsArray);

            io.to(randomSocket).emit('supply');
        } else {
            console.log("shit");
            socket.join(groupid)
            socket.groupid = groupid
        }

    })

    socket.on('freshdata', (text) => {
        console.log(socket.groupid, socket.id, text);
        socket.to(socket.groupid).emit('freshdata', text);
    })

})

let port = process.env.PORT || 4000;
http.listen(port, () => {
    console.log("Server is Listening");
})
