import io from 'socket.io-client';
const socket = io('http://localhost:3001');
//const  socket = openSocket('http://localhost:3001');

function addUser() {
  alert("Usao!");
  socket.emit('add user', 'Filip');
  socket.on('login', timestamp => {alert('Uspelo');});
  //socket.emit('addUser', 1000);
}
export { addUser };