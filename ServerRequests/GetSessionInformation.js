module.exports = {
    name: 'session_info',
    async execute(MAIN_ROUTER, args, res) 
    {
      if (!MAIN_ROUTER.GAME_SESSIONS[args.sessionID]) return res.sendStatus(400)
      if (MAIN_ROUTER.GAME_SESSIONS[args.sessionID].password != args.password) return res.sendStatus(400)
      let gameCost = MAIN_ROUTER.GAME_SESSIONS[args.sessionID].gameCost
      let playersAmount = MAIN_ROUTER.GAME_SESSIONS[args.sessionID].playersAmount
      res.json({"gameCost":gameCost, "playersAmount":playersAmount})
    }
  };