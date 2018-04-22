import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3000');


function receivedAnalogy(cb) {
  socket.on('wordResult', analogy => cb(null, analogy));
}
export { receivedAnalogy };