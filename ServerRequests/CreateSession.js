const GameSession = require("../GameSession/GameSession");
const $ = require('coffeetils')

module.exports = {
  name: 'create_session',
  async execute(MAIN_ROUTER, args, res) {
    if (!args.playersAmount) return res.sendStatus(400)
    if (!parseInt(args.playersAmount, 10)) return res.sendStatus(400)

    let sessionID = (Date.now() / 2).toFixed(0)
    let password = (Date.now() / 3).toFixed(0)
    if (MAIN_ROUTER.GAME_SESSIONS[sessionID]) return this.execute(MAIN_ROUTER, args, res)
    let game = new GameSession(sessionID, password, $.Clamp(parseInt(args.playersAmount, 10), MAIN_ROUTER.config.minPlayersAmount, MAIN_ROUTER.config.maxPlayersAmount))
    game.ResetAFKTimeout(MAIN_ROUTER)
    MAIN_ROUTER.GAME_SESSIONS[sessionID] = game
    res.json({ "sessionID": sessionID, "password": password })
  }
};