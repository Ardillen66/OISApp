var sparqlClient = require('sparql-client');
	mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '<password>',
    database : 'fooddb'
});

module.exports = {
	addRecipe: function addRecipe(user, recipe){
		var query = "INSERT INTO recipe (name, guide, recipeCategory, madeByUserID) VALUES (? , ? , ?, ?)"; 
		var recipeID;
		connection.connect();
		connection.query(query, [recipe.name, recipe.guide, recipe.type, user.id], function(err, result){
			 if (err) throw err;
			 recipeID = result.insertId;
			 console.log(result.insertId);
		});
		var ingreds = recipe.ingredients;
		for (var i = ingreds.length - 1; i >= 0; i--) {
			query = "INSERT INTO recipecontainsingredient (RecipeID, IngredientID) VALUES (? , ?)";
			connection.query(query, [recipeID, ingreds[i]], function(err, result){
			 if (err) throw err;
			 console.log(result.insertId);
			});
		};
		connection.end();

	},

	addAllergen: function addAllergen(name){
		var query = "INSERT INTO allergen (name) VALUES (?)";
		connection.connect();
		connection.query(query, [name], function(err, result){
			 if (err) throw err;
			 console.log(result.insertId);
		});
		connection.end();
	},

	addDiet: function addDiet(user, diet){
		var query = "INSERT INTO diet (name, description, type, madeByUserID) VALUES (? , ? , ? , ?)";
		var dietID;
		connection.connect();
		connection.query(query, [diet.name, diet.description, diet.type, user.id], function(err, result){
			 if (err) throw err;
			 dietID = result.insertId;
			 console.log(result.insertId);
		});
		var meals =  diet.meals;//list of ID's of the meals making up this diet
		for (var i = meals.length - 1; i >= 0; i--) {
			query = "INSERT INTO dietconsistsofmeals (DietID, MealID) VALUES (? , ?)";
			connection.query(query, [dietID, meals[i]], function(err, result){
			 if (err) throw err;
			 console.log(result.insertId);
			});
		};
		connection.end();
	},

	addIngredient: function addIngredient(user, ingred){
		var query = "INSERT INTO ingredient (name) VALUES (?)"; 
		var ingredID;
		connection.connect();
		connection.query(query, [ingred.name], function(err, result){
			 if (err) throw err;
			 ingredID = result.insertId;
			 console.log(result.insertId);
		});
		var allergens = ingred.allergens;
		for (var i = allergens.length - 1; i >= 0; i--) {
		 	query = "INSERT INTO ingredientcontainsallergen (IngredientID, AllergenID) VALUES (? , ?)";
			connection.query(query, [ingredID, allergens[i]], function(err, result){
			 if (err) throw err;
			 console.log(result.insertId);
			});
		 }; 
		connection.end();
	},

	addMeal: function addMeal(user, meal){
		var query = "INSERT INTO meal (name, madeByUserID) VALUES (? , ?)";
		var mealID;
		connection.connect();
		connection.query(query, [meal.name, user.id], function(err, result){
			 if (err) throw err;
			 mealID = result.insertId;
			 console.log(result.insertId);
		});
		var recipes =  meal.recipes;//list of ID's of the recipes making up this meal
		for (var i = meals.length - 1; i >= 0; i--) {
			query = "INSERT INTO dietconsistsofmeals (DietID, MealID) VALUES (? , ?)";
			connection.query(query, [mealID, recipes[i]], function(err, result){
			 if (err) throw err;
			 console.log(result.insertId);
			});
		};
		connection.end();
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////// USER DATABASE FUNCTIONS ////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//inserts new user in the database
	insertNewUser: function insertNewUser(email,password,professional) {
		query = "INSERT INTO user (email,password,professional) VALUES (?,?,?)";
	    connection.query(query, [email,password,professional], function(err, result){
		 if (err) throw err;
		});
	},


	//edits user information in the database
	editAccount: function editAccount(uid,password,email,professional) {
	  if (password != "") {
	    query = "UPDATE user SET password=? WHERE id='" + uid + "'";
	    connection.query(query, [password], function(err, result){
		 if (err) throw err;
		 console.log(result.changedRows);
		});
	  }
	  if (email != "") {
	    query = "UPDATE user SET email=? WHERE id='" + uid + "'";
	    connection.query(query, [email], function(err, result){
		 if (err) throw err;
		 console.log(result.changedRows);
		});
	  }
	  if (professional != "") {
	    query = "UPDATE user SET professional=? WHERE id='" + uid + "'";
	    connection.query(query, [professional], function(err, result){
		 if (err) throw err;
		 console.log(result.changedRows);
		});
	  }
	},

	//checks if a user is present in the database
	authenticateUser: function authenticateUser(email,password,callback) {
	  query = "SELECT id FROM user WHERE email = '" + email + "' AND password = '" + password + "' LIMIT 1";
	  connection.query(query, function(err, results, fields){		//This function will be called if a match is found in the database.
	    console.log(results);
	    console.log(fields);
	    callback(null);
	  });
	},

		//checks with the database if a register is valid
	registerCheck: function registerCheck(email, password1, password2, callback) {
	  var validRegister = true;
	  var errorlist = [];
	  query = "SELECT * FROM user WHERE email = '" + email + "'";
	  connection.query(query, function(err, results, fields) {
	  	if (results.length < 1) {
	  		errorlist.push(email);
	  		if (password1 != password2) {
	        	validRegister = false;
	        	var passwordError = "Passwords do not match";
	        	errorlist.push(passwordError);
	      	}
	  	}
	  	else {
	  		validRegister = false;
	        var emailError = "E-mail is already used";
	        errorlist.push(emailError);
	  	}
	  	if (!validRegister) {
	        callback(errorlist);
	      } else {
	        callback(validRegister);
	      }
	  });
	},

	//checks with the database if an account edit is valid
	editAccCheck: function editAccCheck(password1, password2, email, uid, callback) {
	  var validEdit = true;
	  var errorlist = [];
	  query = "SELECT * FROM user WHERE email = '" + email + "'";
	  connection.query(query, function(err, results, fields) {
		console.log(results);
	  	console.log(fields);
	  	callback(errorlist);
	  });
	}
	//     db.get("SELECT * FROM users WHERE email = '" + email + "'", function(err, row) {
	//       if (typeof row != "undefined") {
	//         validEdit = false;
	//         var emailError = "E-mail is already used";
	//         errorlist.push(emailError);
	//       } else {
	//         errorlist.push(email);
	//       }
	//       if (password1 != password2) {
	//         validEdit = false;
	//         var passwordError = "Passwords do not match";
	//         errorlist.push(passwordError);
	//       }
	//       if (!validEdit) {
	//         callback(errorlist);
	//       } else {
	//         callback(validEdit);
	//       }
	//     });
	// }
}