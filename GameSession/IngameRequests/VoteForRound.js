module.exports = {
    name: 'ready_for_round',
    async execute(MAIN_ROUTER, args, socket) {
        if (!MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID]) return
        if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].password != args[0].password) return

        MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket.id].newRound = true
        var everyoneVoted = true

        for(socket in MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets)
        {
            if (MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].sockets[socket].newRound == false) {everyoneVoted = false; return}
        }

        if (everyoneVoted)
        {
            MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].roundNumber += 1
            MAIN_ROUTER.GAME_SESSIONS[args[0].sessionID].GetDialog(MAIN_ROUTER)
        }
    }
};