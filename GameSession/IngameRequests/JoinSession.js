module.exports = {
  name: 'join_session',
  async execute(MAIN_ROUTER, args, socket) {
    if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
    if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return
    if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].isWaitingStage) return

    socket.join(args[0].sessionID)
    socket.emit("join_session_response", {
      "currentPlayersAmount": MAIN_ROUTER.io.sockets.adapter.rooms.get(args[0].sessionID).size,
      "playersAmount": MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].playersAmount
    })

    socket.to(args[0].sessionID).emit("player_connected", {
      "currentPlayersAmount": MAIN_ROUTER.io.sockets.adapter.rooms.get(args[0].sessionID).size,
      "playersAmount": MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].playersAmount,
      "nickname" : args[0].nickname
    })

    socket.emit("qr_code_data", `CHR$` + `{"sessionID":"${args[0].sessionID}", "password":"${args[0].password}"}`)

    MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket.id] = {"nickname" : args[0].nickname, "score" : 0}
    MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].CheckForFullGame(MAIN_ROUTER, socket)
  }
};