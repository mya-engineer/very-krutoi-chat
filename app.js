const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const path = require('path')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const BOT = { username: 'MYASHA-BOT~', avatar: 0, bot: true }

const handleUser = async () => {
  const users = await io
    .fetchSockets()
    .then(sockets => sockets.map(socket => socket.data.user))

  users.sort((a, b) => {
    if (a.username.toUpperCase() < b.username.toUpperCase()) {
      return -1
    } else if (a.username.toUpperCase() > b.username.toUpperCase()) {
      return 1
    } else {
      return 0
    }
  })

  io.emit('users:list', users)
}

io.on('connection', socket => {
  socket.on('message', obj => {
    io.emit('message', obj)
  })

  socket.on('user', payload => {
    socket.data.user = payload.user
    io.emit('message', {
      message: `Welcome, @${socket.data.user.username}!`,
      user: BOT,
    })

    handleUser()
  })

  socket.on('disconnect', reason => {
    if (socket.data.user) {
      io.emit('message', {
        message: `Farewell, @${socket.data.user.username}...`,
        user: BOT,
      })
      handleUser()
    }
  })
})

const PORT = process.env.PORT || 8888

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
