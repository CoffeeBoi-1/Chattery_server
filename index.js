const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { readdirSync } = require('fs');
const { join } = require('path');
const { Socket } = require('socket.io');
const $ = require('coffeetils')

const MAIN_ROUTER = {}
MAIN_ROUTER.serverRequests = {}
MAIN_ROUTER.ingameRequests = {}
MAIN_ROUTER.io = io

const GAME_SESSIONS = {}

const requestFiles = readdirSync(join(__dirname, 'ServerRequests')).filter((file) => file.endsWith('.js'));
for (const file of requestFiles) {
  const request = require(join(__dirname, 'ServerRequests', `${file}`));
  let requestName = request.name;
  MAIN_ROUTER.serverRequests[requestName] = request
}

const requestFilesIngame = readdirSync(join(__dirname, 'GameSession\\IngameRequests')).filter((file) => file.endsWith('.js'));
for (const file of requestFilesIngame) {
  const request = require(join(__dirname, 'GameSession\\IngameRequests', `${file}`));
  let requestName = request.name;
  MAIN_ROUTER.ingameRequests[requestName] = request
}

app.get('/host_room', (req, res) =>{
  res.sendFile(__dirname+'/index.html')
})

app.all('*', (req, res, next) => {
  const path = req.path.replace("/", "")
  const command = MAIN_ROUTER.serverRequests[path]

  if (!req.query.obj) return res.sendStatus(400)
  req.query.obj = req.query.obj.replace(/'/g, `"`)
  if (!$.IsJsonString(req.query.obj)) return res.sendStatus(400)

  const args = JSON.parse(req.query.obj)

  if (!command) return res.sendStatus(400);

  command.execute(MAIN_ROUTER, args, res)
  next();
});
  
io.on('connection', (socket) => {
    socket.join("aa")
    console.log('user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})
  
http.listen(3000, () => {
    console.log('Main router is running!');
});