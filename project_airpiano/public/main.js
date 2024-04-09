const socket = io('http://localhost:3004');
let colorIndex = 0;
const colors = ['#ff7675', '#74b9ff', '#55efc4']; // Red, Blue, Green

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('distanceData', (data) => {
  const distanceDisplay = document.getElementById('distance-display');
  distanceDisplay.textContent = `Distance: ${data.distance}`;

  
  if (data.distance < 31) {
    
    distanceDisplay.style.backgroundColor = colors[colorIndex];

    
    document.getElementById('music-playing').classList.remove('hidden');
    document.getElementById('music-stopped').classList.add('hidden');

    
    colorIndex = (colorIndex + 1) % colors.length;

    
    logMusicEvent('Music Played');
  } else {
    
    distanceDisplay.style.backgroundColor = '#ffffff'; // White color

    // Hide the "Music Playing" button and show the "Music Stopped" button
    document.getElementById('music-playing').classList.add('hidden');
    document.getElementById('music-stopped').classList.remove('hidden');
  }
});


function logMusicEvent(event) {
  
  if (event === 'Music Played') {
    
    const logList = document.getElementById('log-list');
    const logItem = document.createElement('li');
    logItem.textContent = event + ' - ' + new Date().toLocaleString();
    logList.appendChild(logItem);

    
    sendLogEntryToServer(event);
  }
}



function sendLogEntryToServer(logEntry) {
  fetch('http://localhost:3004/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry: logEntry }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Log entry sent successfully');
    })
    .catch(error => {
      console.error('Error sending log entry:', error);
    });
}

function registerUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  

  
  document.getElementById('user-registration').style.display = 'none';
  document.getElementById('sensor-container').style.display = 'block';
  document.getElementById('melody-controls').style.display = 'block';
  
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  

  
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('melody-controls').style.display = 'block';
  
}

function playMelody() {
  socket.emit('playMelody');
}

function stopMelody() {
  socket.emit('stopMelody');
}
