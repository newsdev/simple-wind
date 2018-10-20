var { execSync } = require('child_process')
var fs = require('fs')


var cmdStr = fs.readFileSync(__dirname + '/download.sh', 'utf8')

// execSync(cmdStr.replace(/20181006/g, '20181007'))
// execSync(cmdStr.replace(/20181006/g, '20181008'))
// execSync(cmdStr.replace(/20181006/g, '20181009'))
// execSync(cmdStr.replace(/20181006/g, '20181010'))

execSync(cmdStr.replace(/20181006/g, '20181011'))
execSync(cmdStr.replace(/20181006/g, '20181012'))
execSync(cmdStr.replace(/20181006/g, '20181013'))
execSync(cmdStr.replace(/20181006/g, '20181014'))
execSync(cmdStr.replace(/20181006/g, '20181015'))
execSync(cmdStr.replace(/20181006/g, '20181016'))




// var out = ''

// out = out + cmdStr.replace(/20181006/g, '20181009')


// fs.writeFileSync(__dirname + '/download.sh', out)



