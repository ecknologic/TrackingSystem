const io = require('socket.io')(9999, {
path:'/socket.io',
serveClient: false,
pingInterval: 10000,
pingTimeout: 5000,
cookie: false,
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
