const http = require("http");
const url = require("url");
const querystring = require("querystring");

const DEFAULT_PORT = 3000;
const FALLBACK_START = 8000;

// Middleware to parse JSON and URL-encoded bodies
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const contentType = req.headers["content-type"];
        if (contentType === "application/json") {
          resolve(JSON.parse(body));
        } else if (contentType === "application/x-www-form-urlencoded") {
          resolve(querystring.parse(body));
        } else {
          resolve(body); // fallback
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

function router(req, res) {
  const parsedUrl = url.parse(req.url, true); // true to get query as object
  const { pathname, query } = parsedUrl;
  const method = req.method;

  // GET /
  if (method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page");
  }

  // GET /hello?name=Aryan
  else if (method === "GET" && pathname === "/hello") {
    console.log(`🔍 Request: ${req.method} ${pathname}`, query);
    const name = query.name || "Guest";
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Hello, ${name}`);
  }

  // POST /user
  else if (method === "POST" && pathname === "/user") {
    parseBody(req)
      .then((body) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User created", body }));
      })
      .catch((err) => {
        res.writeHead(400);
        res.end(`Invalid body: ${err.message}`);
      });
  }

  // Dynamic route: GET /user/123
  else if (method === "GET" && /^\/user\/\d+$/.test(pathname)) {
    const userId = pathname.split("/")[2];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ userId }));
  }

  // 404
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route Not Found");
  }
}

function startServer(port) {
  const server = http.createServer(router);
  server.listen(port);

  server.on("listening", () => {
    console.log(`✅ Server started on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
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
