module.exports = {
    name: 'ready_for_restart',
    async execute(MAIN_ROUTER, args, socket) {
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
        if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return

        MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket.id].restart = true
        var everyoneVoted = true

        for (socket in MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets){
            if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket].restart == false) { everyoneVoted = false; return }
        }

        if (everyoneVoted) {
            for (socket in MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets){
                MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket].restart = false
                MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket].score = 0
                MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].roundNumber = 1
            }
            MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].GetDialog(MAIN_ROUTER)
        }
    }
};