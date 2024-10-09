import express from 'express';
import {Request, Response} from 'express';
import http from 'http';
import { Server as ServerSocket  } from 'socket.io';
import path from 'path';

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


const server = http.createServer(app);

const io = new ServerSocket(server);

app.get("/", function(req : Request, res : Response) {
    res.render("index.ejs")
});

io.on("connection", function(socket) {
    console.log("Client connected:", socket.id);

    socket.on("send-location", function(data) {
        io.emit("received-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {
        io.emit("Client disconnected:", socket.id);
    });
});


server.listen(3000);