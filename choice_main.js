var parser = require("./choice.js").main;
var lodash = require("lodash");

var parser_return = parser(process.argv.slice(1));

var generateString = function(collection){
	if(collection.length == 1)
		return collection[0];
	var last = collection[collection.length - 1];
	collection.pop();
	return collection.join(", ") + " and "+ last;
}

var generateDS = function(tuples){
	var final = {};
	tuples.forEach(function(tuple){
		final[tuple["NAME"]] = final[tuple["NAME"]] || {};
		final[tuple["NAME"]]["likes"] = [];
		final[tuple["NAME"]]["hates"] = [];
	});
	return final;
}

var fillDS = function(tuples, ds){
	tuples.forEach(function(tuple){
		var type = getType(tuple);
		if(ds[tuple["NAME"]][otherType(type)].indexOf(tuple["CHOICE"]) > -1){
			lodash.pull(ds[tuple["NAME"]][otherType(type)], tuple["CHOICE"])
		}
		ds[tuple["NAME"]][type].push(tuple["CHOICE"]);
	})
	return ds;
}

var otherType = function(type){
	return (type == "likes") ? "hates" : "likes"
}

var getType = function(tuple){
	var _keys = Object.keys(tuple);
	return (_keys.length == 3) ? tuple[_keys[1]] : tuple[_keys[2]];
}

var sentence = function(tuples){
	var ds = generateDS(tuples);
	var filled = fillDS(tuples, ds);
	var _keys = Object.keys(filled);
	return sentenceGenerator(_keys, filled);
}

var sentenceGenerator = function(keys, filledDS){
	var output = "";
	keys.forEach(function(key){
		output += oneSentence(key, "likes", filledDS);
		output += oneSentence(key, "hates", filledDS);
	})
	return output;
}

var oneSentence = function(name, type, filledDS){
	return (filledDS[name][type].length) ? (name +" "+ type +" "+ generateString(filledDS[name][type]) + ".\n") : "";
}

var checker = function(tuples){
	var err_template = ""
	if(tuples[0]["ALSO"]){
		err_template = "SEMANTIC ERROR: \n\n" + tuples[0]["NAME"] +" "+ tuples[0]["ALSO"] +" "+ tuples[0]["TYPE"] +" "+tuples[0]["CHOICE"];
		err_template += " <- also appeared before context."
		return err_template;
	}
}

var out = function(tuples){
	return checker(tuples) || sentence(tuples);
}

console.log(out(parser_return));