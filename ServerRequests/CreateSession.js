const GameSession = require("../GameSession/GameSession");
const $ = require('coffeetils')

module.exports = {
  name: 'create_session',
  async execute(MAIN_ROUTER, args, res) 
  {
    if (!args.gameCost) return res.sendStatus(400)
    if (!args.playersAmount) return res.sendStatus(400)
    let sessionID = (Date.now()/2).toFixed(0)
    let password = (Date.now()/3).toFixed(0)
    let game = new GameSession(sessionID, password, $.Clamp(args.gameCost, 100, 1000), $.Clamp(args.playersAmount, 3, 6))
    MAIN_ROUTER.GAME_SESSIONS[sessionID] = game
    res.json({"sessionID":sessionID, "password":password})
  }
};