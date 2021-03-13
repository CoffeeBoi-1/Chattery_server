module.exports = {
  name: 'session_exists',
  async execute(MAIN_ROUTER, args, res) 
  {
    if (!MAIN_ROUTER.GAME_SESSIONS[args.sessionID]) return res.sendStatus(400)
    return res.sendStatus(200)
  }
};