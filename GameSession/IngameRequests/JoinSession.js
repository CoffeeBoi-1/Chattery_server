module.exports = {
  name: 'join_session',
  async execute(MAIN_ROUTER, args, socket) 
  {
    if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
    if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return
    socket.join(args[0].sessionID)
  }
};