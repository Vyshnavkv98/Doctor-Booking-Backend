import { Socket } from 'socket.io';
import app from './app';
const { Server } = require("socket.io");

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

const io = new Server(server, { cors: true });
const emailToSocketId = new Map()
const socketIdToEmail = new Map()

io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);
  socket.on('Room:join', (data) => {
    const { email, room } = data
    emailToSocketId.set(email, socket.id)
    socketIdToEmail.set(socket.id, email)
    io.to(room).emit('Room:joined', { email, id: socket.id })
    socket.join(room)
    io.to(socket.id,).emit('Room:join', data)
  })

  socket.on('user:call', ({ to, offer }) => {
    io.to(to).emit('incoming:call', { from: socket.id, offer })
  })
  socket.on('call:accepted', ({ to, answer }) => {
    io.to(to).emit('call:accepted', { from: socket.id, answer })
  })

  socket.on('peer:nego:needed', ({ to, offer }) => {
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
  })
  socket.on('peer:nego:done', ({ to, answer }) => {
    io.to(to).emit('peer:nego:final', { from: socket.id, answer })
  })

  socket.on("socket:disconnect", ({ socketId }) => {
    // Handle socket disconnection
    const email = socketIdToEmail.get(socketId);
    if (email) {
      emailToSocketId.delete(email);
      socketIdToEmail.delete(socketId);
    }

    const targetSocket = io.sockets.sockets.get(socketId);
    if (targetSocket) {
      targetSocket.disconnect();
    }
  })
    
})
