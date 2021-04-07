module.exports = {
    name: 'help',
    async execute(MAIN_ROUTER) {
        console.log(MAIN_ROUTER.CONSOLE_COMMANDS)
    }
};