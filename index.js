// THIS IS THE BACKEND SERVER
// WILL MAINTAIN THE REALTIME CODES
// AMONG CONNECTED SOCKETS WITHIN A 
// GROUP DEFINED BY A GROUPID
// IT WILL TAKE SOCKET.IO REQUESTS FROM
// OUR FRONTEND APPLICATION

const express = require('express')
const app = express();
const http = require('http').createServer(app);
const cors = require('cors')
const io = require("socket.io")(http, {
    cors: {
        origins: ["http://localhost:3000", "https://realtime-colab.netlify.app/"],
        methods: ["GET", "POST"]
    }
});

app.use(cors());


app.get('/', (req, res) => {
    res.send("text")
})


io.on('connection', (socket) => {
    console.log("someone joined");
    socket.on('joinning', (groupid) => {
        socket.join(groupid)
        socket.groupid = groupid
    })

    socket.on('give supply', (groupid) => {
        const groupSockets = io.sockets.adapter.rooms.get(groupid);
        const socketsArray = Array.from(groupSockets);
        const randomSocket = socketsArray[0];
        if (randomSocket === socket.id) return;
        io.to(randomSocket).emit('supply');
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
