const express = require('express')
const WebSocket = require("ws");
const app = express()
const https = require('https')
const fs = require('fs')
const port = 3022

// works with:  https://localhost:3022/
// websockets work with: wss://localhost:3022/

app.get('/', (req, res) => {
    res.send("IT'S WORKING!")
})

const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
        console.log('server running at ' + port)
    })

const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws, req, client) {
  console.log("new connection");
  ws.on("message", function (data) {
    console.log("message data", data);
    let um = JSON.parse(data);
    broadcast(um);
  });
});

function broadcast(um) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("broadcast um", um);
      client.send(JSON.stringify(um));
    }
  });
}
