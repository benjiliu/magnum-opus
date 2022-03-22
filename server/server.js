import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const PORT = 5001;

app.use(cors({origin: "http://localhost:3000", methods: ['GET', 'POST']}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  console.log(`Connection established with ${socket.id}`);

  socket.on("clear-canvas", (data) => {
    socket.broadcast.emit("receive-clear-canvas", data);
  });

  socket.on("start-drawing", data => {
    socket.broadcast.emit('receive-drawing', data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected!");
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));