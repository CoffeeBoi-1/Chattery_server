module.exports = {
    name: 'session_exists',
    async execute(MAIN_ROUTER, args, res) {
      if (!MAIN_ROUTER.io.sockets.adapter.rooms.get(args.sessionID)) return res.sendStatus(400)
      return res.sendStatus(200)
  }
};