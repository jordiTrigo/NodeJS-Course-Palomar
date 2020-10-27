const os = require('os');

console.log('Version SO: ', os.release());
console.log('Free Memory: ', os.freemem());
console.log('Total Memory: ' + os.totalmem());