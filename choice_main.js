var parser = require("./choice.js").main;

var parser_return = parser(process.argv.slice(1));

console.log(JSON.stringify(parser_return));

var getList = function(){
	var list = [];

	return function next(firstExp){
		if(firstExp.length == 1){
			list.push(firstExp[0]["sentence"])
			return list
		}else{
			list.push(firstExp[1]["sentence"])
			nextExp = firstExp[0]["expression"]
			return next(nextExp)
		}
	}
}

console.log("List is --",getList()(parser_return["expression"]))