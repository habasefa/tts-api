const chalk = require('chalk')

const success = (mssg) => console.log(chalk.inverse.green('%s'), mssg)
const flag = (mssg) => console.log(chalk.inverse.blue('%s'), mssg)
const warning = (mssg) => console.log(chalk.inverse.orange('%s'), mssg)
const error = (mssg) => console.log(chalk.inverse.red('%s'), mssg)
const info = (mssg) => console.log(chalk.inverse.yellow('%s'), mssg)

module.exports = {
    error,
    flag,
    success,
    warning,
    info,
}
