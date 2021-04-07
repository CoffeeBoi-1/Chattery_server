/* 
socket->{
    "nickname" : args[0].nickname
}

dialog->{
    text:"aaaaa!?", 
    from:"me" / partner
}
*/

class GameSession 
{
    constructor(sessionID, password, playersAmount) 
    {
        this.sessionID = sessionID
        this.password = password
        this.playersAmount = playersAmount
        this.isWaitingStage = true
        this.sockets = {}
    }

    CheckForDeleteSession(MAIN_ROUTER)
    {
        if (this.isWaitingStage && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID)) return
        if (!this.isWaitingStage && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID) && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID).size >= 3) return
        //Таймаут за бездействие

        MAIN_ROUTER.io.in(this.sessionID).emit("session_close")
        delete MAIN_ROUTER.GAME_SESSIONS[this.sessionID]
    }

    CheckForFullGame(MAIN_ROUTER)
    {
        var currentPlayersAmount = MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID).size
        if(currentPlayersAmount != this.playersAmount) return

        this.isWaitingStage = false
        MAIN_ROUTER.io.in(this.sessionID).emit("game_ready")
        this.SendNewDialog(MAIN_ROUTER)
    }

    SendNewDialog(MAIN_ROUTER)
    {
        var dialog = []
        dialog.push({text:"aaaaa!?", from:"me"})
        MAIN_ROUTER.io.in(this.sessionID).emit("new_dialog", dialog)
    }
}

module.exports = GameSession