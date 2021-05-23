module.exports = {
    name: 'get_dialog',
    async execute(MAIN_ROUTER, args, socket) {
        if (args[0].dialog.length == 0) return
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
        if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[args[0].socketID]) return

        MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].SendNewDialog(MAIN_ROUTER, args[0].socketID, args[0].dialog)
    }
};