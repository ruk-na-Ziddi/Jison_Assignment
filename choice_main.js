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

var getNames = function(tuples){
	return lodash.uniq(tuples.map(function(tuple){
		return tuple["NAME"];
	}))
}

var generateDS = function(names){
	var ds = {};
	names.forEach(function(name){
		ds[name] = {};
		ds[name]["likes"] = [];
		ds[name]["hates"] = [];
	});
	return ds;
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

var summary = function(tuples){
	var ds = generateDS(getNames(tuples));
	var filled = fillDS(tuples, ds);
	var _keys = Object.keys(filled);
	return sentenceGenerator(_keys, filled);
}

var sentenceGenerator = function(keys, filledDS){
	var output = "";
	keys.forEach(function(key){
		output += sentence(key, "likes", filledDS);
		output += sentence(key, "hates", filledDS);
	})
	return output;
}

var sentence = function(name, type, filledDS){
	return (filledDS[name][type].length) ? (name +" "+ type +" "+ generateString(filledDS[name][type]) + ".\n") : "";
}

var errChecker = function(tuples){
	var err_template = ""
	if(tuples[0]["ALSO"]){
		err_template = "SEMANTIC ERROR: \n\n" + tuples[0]["NAME"] +" "+ tuples[0]["ALSO"] +" "+ tuples[0]["TYPE"] +" "+tuples[0]["CHOICE"];
		err_template += " <- also appeared before context."
		return err_template;
	}
}

var out = function(tuples){
	return errChecker(tuples) || summary(tuples);
}

console.log(out(parser_return));