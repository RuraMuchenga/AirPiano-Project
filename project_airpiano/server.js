const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('db.json');
const db = low(adapter);


db.defaults({ logs: [] }).write();

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('distanceData', (data) => {
    console.log('Distance data received:', data);

    const distanceData = data.distance;
    io.emit('distanceData', { distance: distanceData });

    
    logDistanceEvent(distanceData);
  });

  
  socket.on('customMelodyStarted', () => {
    
    console.log('Custom melody started');


  });
});

app.get('/get_distance', (req, res) => {
  res.json({ message: 'Distance route is active' });
});


app.get('/history', (req, res) => {
  const history = db.get('logs').value();
  res.json(history);
});

const server = http.listen(3004, () => {
  console.log('Server is listening on port 3004');
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});


function logDistanceEvent(distance) {
  const logEntry = { timestamp: new Date(), distance: distance };
  db.get('logs').push(logEntry).write();
}
