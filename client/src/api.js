import io from 'socket.io-client';
import { create } from 'domain';
const socket = io('http://localhost:3001');
//const  socket = openSocket('http://localhost:3001');

function addUser() {
  socket.emit('add user', 'Filip');
  socket.on('login', timestamp => {console.log('Socket opened');});
  //socket.emit('addUser', 1000);
}

function createSheet(sheetIdCall){
  let newSheet={
    "name":"New spreadsheet"
  };
  socket.emit("create sheet",newSheet);
  socket.on("new sheet", sheetId=> sheetIdCall(sheetId));
}

function openSheet(sheetId,openSheetCallback){
let message={
    "sheetId":sheetId,
    "name":"Filip"
  };
  //alert(JSON.stringify(message));
  socket.emit("open sheet",message);
  socket.on("sheet data",sheetData=> openSheetCallback(sheetData));
}

function closeSheet(sheetIdCall){
  let newSheet={
    "name":"New spreadsheet"
  };
  socket.emit("create sheet",newSheet);
  socket.on("new sheet", sheetId=> sheetIdCall(sheetId));
}
export { addUser,createSheet,openSheet };