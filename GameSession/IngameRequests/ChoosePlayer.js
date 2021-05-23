module.exports = {
    name: 'send_choice',
    async execute(MAIN_ROUTER, args, socket) {
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
        if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[args[0].socketID]) return

        MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket.id].choice = args[0].socketID
    }
};