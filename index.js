const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    if(!req.query.password) return res.sendStatus(403)
    res.sendStatus(200)
});
  
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})
  
http.listen(3000, () => {
    console.log('Main router is running!');
});