class GameSession 
{
    constructor(sessionID, password, gameCost, playersAmount) 
    {
        this.sessionID = sessionID
        this.password = password
        this.gameCost = gameCost
        this.playersAmount = playersAmount
    }
}

module.exports = GameSession