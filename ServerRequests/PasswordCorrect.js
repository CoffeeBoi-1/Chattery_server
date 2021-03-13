module.exports = {
    name: 'password_correct',
    async execute(MAIN_ROUTER, args, res) 
    {
        if (!MAIN_ROUTER.GAME_SESSIONS[args.sessionID]) return res.sendStatus(400)
        if (MAIN_ROUTER.GAME_SESSIONS[args.sessionID].password != args.password) return res.sendStatus(400)
        return res.sendStatus(200)
    }
};