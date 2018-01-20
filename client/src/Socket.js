import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

function userManagement(cb) {
  socket.on('login', user => console.log("Ulogovan user: "+user));
  socket.emit('add user', "User"+(Date.now()));
}
export { userManagement };