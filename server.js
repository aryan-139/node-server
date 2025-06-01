const http = require('http');

const DEFAULT_PORT = 3000;
const FALLBACK_START = 8000;

function startServer(port) {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Server is running on port ${port}\n`);
  });

  server.listen(port);

  server.on('listening', () => {
    console.log(`✅ Server started on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use. Trying next port...`);
      // Try next port (increment by 1 if we’re already in fallback zone)
      const nextPort = port < FALLBACK_START ? FALLBACK_START : port + 1;
      startServer(nextPort);
    } else {
      console.error(`❌ Unexpected server error: ${err.message}`);
    }
  });
}

// Start from DEFAULT_PORT
startServer(DEFAULT_PORT);
