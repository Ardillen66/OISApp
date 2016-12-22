var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://localhost:2020/sparql';

var client = new SparqlClient(endpoint);

//Dirty hack to wait on query results 
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

//Selects all recipes filtering out those containing ingreients the user is allergic to/
//Optionally takes aguments type, name, madeBy
function getRecipes (user, type , name, madeBy) {
	var queryStr = "SELECT * WHERE {?recipe a <http://localhost:2020/resource/vocab/recipe>.";
	var res;
	if(typeof type !== 'undefined'){
		var arg = "?recipe <http://localhost:2020/resource/vocab/recipe_recipeCategory> " + "\"" + type + "\".";
		queryStr +=  arg;
	}
	if(typeof name !== 'undefined'){
		var arg = "?recipe <http://localhost:2020/resource/vocab/recipe_name> " + "\"" + name + "\".";
		queryStr +=  arg;
	}
	if(typeof madeBy !== 'undefined'){
		var arg = "?recipe <http://localhost:2020/resource/vocab/recipe_madeByUserID> " + madeBy;
		queryStr +=  arg;
	}
	//This part of the query should filter out recipes cotaining ingredients that caonatin allergens the user is allergic to
	queryStr += "?recipe <http://localhost:2020/resource/vocab/recipecontainsingredients> ?ingredient.
				?ingredient <http://localhost:2020/resource/vocab/ingredientcontainsallergens> ?allergen.
				?user <http://localhost:2020/resource/vocab/user_idUser> " + user.id +
				". ?FILTER( EXISTS {?user <http://localhost:2020/resource/vocab/user_idUser> ?allergen})";
	var done = false;
	client.query(queryStr).execute(function(error, results) {
		res = results;
		done = true;
	});
	//Wait for query because this call is aync (Should be reimplemented asynchronously)
	while(done == false){
		console.log("Retrieving recipes");
		sleep(100);//Sleep 100 ms
	}
	return res
}