var parser = require("./choice.js").main;

var parser_return = parser(process.argv.slice(1));

console.log(JSON.stringify(parser_return));
