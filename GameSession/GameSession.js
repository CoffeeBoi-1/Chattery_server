/* 
socket->{
    "nickname" : "",
    "choice" : "",
    "newRound" : false,
    "restart" : false,
    "score" : 0
}

dialog->{
    text:"aaaaa!?", 
    from:"me" / partner
}
*/

class GameSession {
    constructor(sessionID, password, playersAmount) {
        this.sessionID = sessionID
        this.password = password
        this.playersAmount = playersAmount
        this.isWaitingStage = true
        this.correctAnswer
        this.roundTimeout
        this.afkTimeout
        this.sockets = {}
        this.roundNumber = 1
    }

    ResetAFKTimeout(MAIN_ROUTER) {
        clearTimeout(this.afkTimeout)
        this.afkTimeout = null
        this.afkTimeout = setTimeout(() => {
            clearTimeout(this.roundTimeout)
            this.roundTimeout = null
            MAIN_ROUTER.io.in(this.sessionID).emit("session_close")
            delete MAIN_ROUTER.GAME_SESSIONS[this.sessionID]
        }, MAIN_ROUTER.config.afkTimeout)
    }

    CheckForDeleteSession(MAIN_ROUTER) {
        if (this.isWaitingStage && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID)) return
        if (!this.isWaitingStage && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID) && MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID).size >= MAIN_ROUTER.config.minPlayersAmount) return
        //Таймаут за бездействие

        clearTimeout(this.roundTimeout)
        this.roundTimeout = null
        MAIN_ROUTER.io.in(this.sessionID).emit("session_close")
        delete MAIN_ROUTER.GAME_SESSIONS[this.sessionID]
    }

    CheckForFullGame(MAIN_ROUTER) {
        var currentPlayersAmount = MAIN_ROUTER.io.sockets.adapter.rooms.get(this.sessionID).size
        if (currentPlayersAmount != this.playersAmount) return

        this.isWaitingStage = false
        MAIN_ROUTER.io.in(this.sessionID).emit("game_ready")
        this.GetDialog(MAIN_ROUTER)
    }

    SendNewDialog(MAIN_ROUTER, socketID, dialog) {
        this.correctAnswer = socketID
        clearTimeout(this.roundTimeout)
        this.roundTimeout = null
        this.roundTimeout = setTimeout(() => {
            var winTab = {}
            for (var socket in this.sockets) {
                winTab[socket] = false
                if (this.sockets[socket].choice == this.correctAnswer) {
                    this.sockets[socket].score += 1
                    winTab[socket] = true
                }
                this.sockets[socket].choice = ""
                this.sockets[socket].newRound = false
            }
            if (this.roundNumber < MAIN_ROUTER.config.roundsAmount) MAIN_ROUTER.io.in(this.sessionID).emit("request_for_round",
                { "winTab": winTab, "correctAnswer": this.sockets[this.correctAnswer].nickname, "roundsEnd": false, "isAd": false })

            if (this.roundNumber == MAIN_ROUTER.config.roundsAmount) {
                var biggestScore = 0
                var winnerName = ""
                for (var socket in this.sockets) {
                    if (this.sockets[socket].score > biggestScore) {
                        biggestScore = this.sockets[socket].score
                        winnerName = this.sockets[socket].nickname
                    }
                }
                MAIN_ROUTER.io.in(this.sessionID).emit("request_for_round", { "winnerName": winnerName, "roundsEnd": true, "isAd": false })
            }
        }, 60000)


        var nicknames = []
        for (var socket in this.sockets) {
            nicknames.push({ "nickname": this.sockets[socket].nickname, "socketID": socket })
        }
        MAIN_ROUTER.io.in(this.sessionID).emit("new_dialog", { "dialog": dialog, "nicknames": nicknames })
    }

    async GetDialog(MAIN_ROUTER) {
        const keys = Object.keys(this.sockets)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]

        await MAIN_ROUTER.io.to(randKey).emit("get_dialog")
    }
}

module.exports = GameSession