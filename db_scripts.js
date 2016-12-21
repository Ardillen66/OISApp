var sparqlClient = require('sparql-client');
var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'abc123',
  database : 'fooddb'
});




function addRecipe(user, recipe){
	var query = "INSERT INTO recipe VALUES (? , ? , ? , ?, ?)"; 
	var recipeID;
	connection.connect();
	connection.query(query, [recipe.name, recipe.rating, recipe.guide, recipe.type, user.id], function(err, result){
		 if (err) throw err;
		 recipeID = result.insertId;
		 console.log(result.insertId);
	});
	var ingreds = recipe.ingredients;
	for (var i = ingreds.length - 1; i >= 0; i--) {
		query = "INSERT INTO recipecontainsingredient VALUES (? , ?)";
		connection.query(query, [recipeID, ingreds[i]], function(err, result){
		 if (err) throw err;
		 console.log(result.insertId);
		});
	};
	connection.end();

}

function addAllergen(name){
	var query = "INSERT INTO allergen VALUES (?)";
	connection.connect();
	connection.query(query, [name], function(err, result){
		 if (err) throw err;
		 console.log(result.insertId);
	});
	connection.end();
}

function addDiet(user, diet){
	var query = "INSERT INTO diet VALUES (? , ? , ? , ?)";
	var dietID;
	connection.connect();
	connection.query(query, [diet.name, diet.description, diet.type, user.id], function(err, result){
		 if (err) throw err;
		 dietID = result.insertId;
		 console.log(result.insertId);
	});
	var meals =  diet.meals;//list of ID's of the meals making up this diet
	for (var i = meals.length - 1; i >= 0; i--) {
		query = "INSERT INTO dietconsistsofmeals VALUES (? , ?)";
		connection.query(query, [dietID, meals[i]], function(err, result){
		 if (err) throw err;
		 console.log(result.insertId);
		});
	};
	connection.end();
}

function addIngredient(user, ingred){
	var query = "INSERT INTO ingredient VALUES (?)"; 
	var ingredID;
	connection.connect();
	connection.query(query, [ingred.name], function(err, result){
		 if (err) throw err;
		 ingredID = result.insertId;
		 console.log(result.insertId);
	});
	var allergens = ingred.allergens;
	for (var i = allergens.length - 1; i >= 0; i--) {
	 	query = "INSERT INTO ingredientcontainsallergen VALUES (? , ?)";
		connection.query(query, [ingredID, allergens[i]], function(err, result){
		 if (err) throw err;
		 console.log(result.insertId);
		});
	 }; 
	connection.end();
}

function addMeal(user, meal){
	var query = "INSERT INTO meal VALUES (? , ?)";
	var mealID;
	connection.connect();
	connection.query(query, [meal.name, user.id], function(err, result){
		 if (err) throw err;
		 mealID = result.insertId;
		 console.log(result.insertId);
	});
	var recipes =  meal.recipes;//list of ID's of the recipes making up this meal
	for (var i = meals.length - 1; i >= 0; i--) {
		query = "INSERT INTO dietconsistsofmeals VALUES (? , ?)";
		connection.query(query, [mealID, recipes[i]], function(err, result){
		 if (err) throw err;
		 console.log(result.insertId);
		});
	};
	connection.end();
}

