import { Socket } from 'socket.io';
import app from './app';
const { Server } = require("socket.io");

const port = process.env.PORT || 5000;
const server=app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

const io = new Server(server, { cors: true });

io.on('connection', (socket:Socket)=>{
  console.log('socket connected',socket.id);
  
})
