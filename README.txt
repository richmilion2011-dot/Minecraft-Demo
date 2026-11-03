VOXEL WORLD — Netlify + multiplayer rooms

WHAT'S INCLUDED
- index.html: browser game, Bedrock-inspired menu, multiplayer panel, room code field,
  voxel-style player models, basic Survival/Creative mode selection.
- server.js: Node.js + Socket.IO server with room-separated players and block edits.
- package.json: server dependencies.

DEPLOY THE GAME
1. Upload index.html to your Netlify site (the published file should be named index.html).

DEPLOY THE MULTIPLAYER SERVER
1. Deploy server.js and package.json to a Node.js host that supports long-running processes
   and WebSockets (not a static-only Netlify site).
2. Run: npm install
3. Start command: npm start
4. Copy the public HTTPS address from the server host.

PLAY WITH FRIENDS
1. Open the Netlify game.
2. Open "Сетевая игра".
3. Enter a nickname, server URL and a room code.
4. Everyone who enters the same room code and server URL joins the same room.

IMPORTANT LIMITATIONS
- This is still a prototype, not a complete Minecraft clone.
- Terrain is generated client-side, so procedural terrain may differ if clients use different seeds.
- Shared edits are stored per room in server memory and are lost when the server restarts.
- Survival/Creative currently provide a mode choice and HUD only; full hunger/health damage,
  crafting, inventory rules and creative flight are not implemented yet.
- Player models are simple voxel-style figures, not official Minecraft skins.
- For a public server, add authentication, rate limiting, robust server-side validation,
  persistent storage and moderation before sharing widely.
