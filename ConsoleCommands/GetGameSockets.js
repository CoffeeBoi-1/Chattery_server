module.exports = {
    name: 'get_game_sockets',
    description: 'get_game_sockets [roomID]',
    async execute(MAIN_ROUTER, args) {
        console.log(MAIN_ROUTER.GAME_SESSIONS[args[0]].sockets)
    }
};