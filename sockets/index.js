const io = require('socket.io')(9999, {
    cors: {
        origin: ['http://localhost:3000', 'http://15.207.25.20:8888', 'https://bibowater.org','https://65.1.190.193:8888']
    }
})

io.on('connection', socket => {
    console.log(socket.id)
})


function getSocketIo() {
    return io;
}

module.exports.getSocketIo = getSocketIo
