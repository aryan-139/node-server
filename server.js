const http = require("http");

// Define a port
const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Set response header
  res.setHeader("Content-Type", "text/plain");

  // Routing logic
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end("Welcome to the homepage!");
  } else if (req.url === "/about" && req.method === "GET") {
    res.statusCode = 200;
    res.end("This is the about page.");
  } else {
    res.statusCode = 404;
    res.end("Page not found.");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
