module.exports = {
  name: 'session_info',
  async execute(MAIN_ROUTER, args, res) 
  {
    if (!MAIN_ROUTER.GAME_SESSIONS[args.sessionID]) return res.json({ "error": "invalid_session" })
    if (MAIN_ROUTER.GAME_SESSIONS[args.sessionID].password != args.password) return res.json({ "error": "invalid_session" })
    if (!MAIN_ROUTER.GAME_SESSIONS[args.sessionID].isWaitingStage) return res.json({ "error": "invalid_session" })
    if (!args.nickname) return res.json({ "error": "invalid_nickname" })
    if (!this.NicknameAvailable(MAIN_ROUTER, args)) return res.json({ "error": "invalid_nickname" })

    let playersAmount = MAIN_ROUTER.GAME_SESSIONS[args.sessionID].playersAmount
    res.json({ "playersAmount": playersAmount })
  },

  NicknameAvailable(MAIN_ROUTER, args) 
  {
    let nicknameUnavailable = false
    let sockets = MAIN_ROUTER.GAME_SESSIONS[args.sessionID].sockets

    for (const key in sockets) {
      if (sockets[key].nickname == args.nickname) nicknameUnavailable = true
    }

    if (nicknameUnavailable) return false
    return true
  }
};