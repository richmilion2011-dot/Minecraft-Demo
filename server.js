// VOXEL WORLD multiplayer server — rooms + shared block edits
// Node.js 18+: npm install && npm start
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  maxHttpBufferSize: 1e6
});
const PORT = process.env.PORT || 3000;
const players = new Map();       // socket id -> player
const rooms = new Map();         // room -> { blocks: Map }
app.get("/", (_req, res) => res.send("VOXEL WORLD multiplayer server is running."));
function roomData(name) {
  if (!rooms.has(name)) rooms.set(name, { blocks: new Map() });
  return rooms.get(name);
}
io.on("connection", socket => {
  socket.on("join", data => {
    const room = String(data?.room || "МИР-1").toUpperCase().replace(/[^A-ZА-Я0-9_-]/g, "").slice(0, 12) || "МИР-1";
    const p = {
      id: socket.id, room,
      nick: String(data?.nick || "Игрок").slice(0, 16),
      mode: data?.mode === "creative" ? "creative" : "survival",
      x: Number(data?.x) || 0, y: Number(data?.y) || 0,
      z: Number(data?.z) || 0, yaw: Number(data?.yaw) || 0
    };
    players.set(socket.id, p);
    socket.join(room);
    const state = roomData(room);
    socket.emit("players", [...players.values()].filter(x => x.room === room && x.id !== socket.id));
    socket.emit("worldBlocks", [...state.blocks.values()]);
    socket.to(room).emit("playerJoined", p);
    socket.emit("roomJoined", { room, mode: p.mode });
  });
  socket.on("move", data => {
    const p = players.get(socket.id);
    if (!p || !data) return;
    for (const k of ["x", "y", "z", "yaw", "pitch"]) {
      if (Number.isFinite(Number(data[k]))) p[k] = Number(data[k]);
    }
    socket.to(p.room).emit("playerMoved", p);
  });
  socket.on("blockChanged", b => {
    const p = players.get(socket.id);
    if (!p || !b || !Number.isInteger(Number(b.x)) || !Number.isInteger(Number(b.y)) ||
        !Number.isInteger(Number(b.z)) || !Number.isInteger(Number(b.id)) ||
        Number(b.y) < 0 || Number(b.y) >= 64 || Math.abs(Number(b.x)) > 100000 ||
        Math.abs(Number(b.z)) > 100000 || Number(b.id) < 0 || Number(b.id) > 10) return;
    const key = `${b.x},${b.y},${b.z}`;
    const block = { x: Number(b.x), y: Number(b.y), z: Number(b.z), id: Number(b.id) };
    const state = roomData(p.room);
    if (block.id === 0) state.blocks.delete(key); else state.blocks.set(key, block);
    socket.to(p.room).emit("blockChanged", block);
  });
  socket.on("disconnect", () => {
    const p = players.get(socket.id);
    if (p) socket.to(p.room).emit("playerLeft", socket.id);
    players.delete(socket.id);
  });
});
server.listen(PORT, "0.0.0.0", () => console.log(`VOXEL WORLD server listening on ${PORT}`));
