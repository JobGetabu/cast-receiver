const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const LOG_FILE = path.join(__dirname, 'cast-logs.json');

// In-memory log storage
let logs = [];

// Load logs from file on startup
try {
  if (fs.existsSync(LOG_FILE)) {
    const data = fs.readFileSync(LOG_FILE, 'utf8');
    logs = JSON.parse(data);
    console.log(`📋 Loaded ${logs.length} previous log entries`);
  }
} catch (error) {
  console.error('Failed to load previous logs:', error);
}

// Save logs to file
function saveLogs() {
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to save logs:', error);
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve index.html
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Serve logs.html
  if (req.url === '/logs.html' || req.url === '/logs') {
    fs.readFile(path.join(__dirname, 'logs.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading logs.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // API: Get logs
  if (req.url === '/api/logs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ logs }));
    return;
  }

  // API: Add log entry
  if (req.url === '/api/logs' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const logEntry = JSON.parse(body);
        logs.push(logEntry);

        // Keep only last 500 logs
        if (logs.length > 500) {
          logs = logs.slice(-500);
        }

        saveLogs();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // API: Clear logs
  if (req.url === '/api/logs' && req.method === 'DELETE') {
    logs = [];
    saveLogs();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('🎬 Cast Receiver Server Started');
  console.log('================================');
  console.log(`📺 Receiver URL: http://localhost:${PORT}`);
  console.log(`📋 Logs URL: http://localhost:${PORT}/logs.html`);
  console.log('');
  console.log('To access from other devices on your network:');
  console.log('1. Find your local IP address (run: ipconfig or ifconfig)');
  console.log('2. Access http://YOUR_IP:' + PORT);
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n💾 Saving logs before shutdown...');
  saveLogs();
  console.log('✅ Logs saved. Goodbye!');
  process.exit(0);
});
