const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { readdirSync } = require('fs');
const { join } = require('path');
const readline = require('readline');
const { Socket } = require('socket.io');
const $ = require('coffeetils')
const config = require('./config.json')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONSOLE_COMMANDS = {}

const MAIN_ROUTER = {}
MAIN_ROUTER.CONSOLE_COMMANDS = CONSOLE_COMMANDS
MAIN_ROUTER.GAME_SESSIONS = {}
MAIN_ROUTER.serverRequests = {}
MAIN_ROUTER.ingameRequests = {}
MAIN_ROUTER.io = io
MAIN_ROUTER.config = config

const requestFiles = readdirSync(join(__dirname, 'ServerRequests')).filter((file) => file.endsWith('.js'));
for (const file of requestFiles) {
  const request = require(join(__dirname, 'ServerRequests', `${file}`));
  let requestName = request.name;
  MAIN_ROUTER.serverRequests[requestName] = request
}

const requestFilesIngame = readdirSync(join(__dirname, 'GameSession/IngameRequests')).filter((file) => file.endsWith('.js'));
for (const file of requestFilesIngame) {
  const request = require(join(__dirname, 'GameSession/IngameRequests', `${file}`));
  let requestName = request.name;
  MAIN_ROUTER.ingameRequests[requestName] = request
}

const consoleCommands = readdirSync(join(__dirname, 'ConsoleCommands')).filter((file) => file.endsWith('.js'));
for (const file of consoleCommands) {
  const command = require(join(__dirname, 'ConsoleCommands', `${file}`));
  let commandName = command.name;
  CONSOLE_COMMANDS[commandName] = command
}

app.all('*', (req, res, next) => {
  try {
    const path = req.path.replace("/", "")
    const command = MAIN_ROUTER.serverRequests[path]

    if (!req.query.obj) return res.sendStatus(400)
    req.query.obj = req.query.obj.replace(/'/g, `"`)
    if (!$.IsJsonString(req.query.obj)) return res.sendStatus(400)

    const args = JSON.parse(req.query.obj)

    if (!command) return res.sendStatus(400);

    command.execute(MAIN_ROUTER, args, res)
    next();
  } catch (error) {
    console.log(error)
  }
});

io.on('connection', (socket) => {
  try {
    socket.on('disconnect', () => {
    });

    socket.on('disconnecting', () => {
      try {
        var rooms = socket.rooms;
        rooms.delete(rooms.values().next().value)
        var room = rooms.values().next().value
        socket.leave(room)

        if (!MAIN_ROUTER.GAME_SESSIONS[room]) return

        MAIN_ROUTER.GAME_SESSIONS[room].CheckForDeleteSession(MAIN_ROUTER, socket)
        if (MAIN_ROUTER.GAME_SESSIONS[room]) MAIN_ROUTER.ingameRequests["ready_for_round"].execute(MAIN_ROUTER,
          [{ "sessionID": room, "password": MAIN_ROUTER.GAME_SESSIONS[room].password }], socket)
        if (MAIN_ROUTER.GAME_SESSIONS[room]) MAIN_ROUTER.ingameRequests["ready_for_restart"].execute(MAIN_ROUTER,
          [{ "sessionID": room, "password": MAIN_ROUTER.GAME_SESSIONS[room].password }], socket)

        if (!MAIN_ROUTER.io.sockets.adapter.rooms.get(room)) return
        if (!MAIN_ROUTER.GAME_SESSIONS[room]) return

        if (MAIN_ROUTER.GAME_SESSIONS[room].sockets[socket.id]) delete MAIN_ROUTER.GAME_SESSIONS[room].sockets[socket.id]

        socket.to(room).emit("player_disconnected", {
          "currentPlayersAmount": MAIN_ROUTER.io.sockets.adapter.rooms.get(room).size,
          "playersAmount": MAIN_ROUTER.GAME_SESSIONS[room].playersAmount
        })
      } catch (error) {
        console.log(error)
      }
    });

    socket.onAny((eventName, ...args) => {
      const command = MAIN_ROUTER.ingameRequests[eventName]
      if (!command) return
      if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID] && MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password == args[0].password) MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].ResetAFKTimeout(MAIN_ROUTER)
      command.execute(MAIN_ROUTER, args, socket)
    });
  } catch (error) {
    console.log(error)
  }
})

http.listen(process.env.PORT || 3000, () => {
  console.log('Main router is running!');
});

rl.on('line', (data) => {
  const args = data.split(/ +/)
  const commandName = args[0]
  args.shift()
  const command = CONSOLE_COMMANDS[commandName]
  if (!command) return
  command.execute(MAIN_ROUTER, args)
})