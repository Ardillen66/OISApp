var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://localhost:2020/sparql';

var client = new SparqlClient(endpoint);

var queryAllRecipes = "SELECT DISTINCT ?id ?recipeName ?recipeCategory ?userEmail WHERE " +
					            "{?recipe <http://localhost:2020/resource/food/recipe_idRecipe> ?id." +
         		          "?recipe <http://localhost:2020/resource/food/recipe_name> ?recipeName." +
          			      "?recipe <http://localhost:2020/resource/food/recipe_recipeCategory> ?recipeCategory." +
           			      "?recipe <http://localhost:2020/resource/food/recipemadebyuser> ?userMadeRecipe." +
           			      "?userMadeRecipe <http://localhost:2020/resource/food/user_email> ?userEmail.}";

module.exports = {
	getRecipesWithoutAllergens: function getRecipesWithoutAllergens(allergen){
		var listOfValidRecipes;
		var queryRecipesContainingAllergens = "SELECT DISTINCT ?id WHERE " +
          							  "{?recipe <http://localhost:2020/resource/food/recipe_idRecipe> ?id." +
           							  "?recipeAllergen <http://localhost:2020/resource/food/allergen_name> ?nameAllergen." +
          							  "?recipeAllergen <http://localhost:2020/resource/food/allergenisofingredient> ?allergenOfIngredient." +
         							    "?recipeIngredient <http://localhost:2020/resource/food/ingredientcontainsallergens> ?allergenOfIngredient." +
          							  "?recipeIngredient <http://localhost:2020/resource/food/ingredientisofrecipe> ?ingredientOfRecipe." +
          							  "?recipe <http://localhost:2020/resource/food/recipecontainsingredients> ?ingredientOfRecipe." +
          							  "FILTER (?nameAllergen='"+allergen+"')}";

        client.query(queryAllRecipes).execute(function(error, results) {
  			client.query(queryRecipesContainingAllergens).execute(function(error2, results2) {
        	for (var i = 0; i < results.results.bindings.length; i++) {
        		var id = results.results.bindings[i].id.value,
        		    name = results.results.bindings[i].recipeName.value,
        		    category = results.results.bindings[i].recipeCategory.value,
        		    email = results.results.bindings[i].userEmail.value,
        		    validRecipe = true;
        		for (var x = 0; x < results2.results.bindings.length; x++) {
        			var id2 = results.results.bindings[x].id.value;
        			if (id == id2) {validRecipe = false};
        		}
        		if (validRecipe == true) {listOfValidRecipes.push([id,name,category,email])};
        		validRecipe = true;
        	}
			});
		});
		setTimeout(function() {
			console.log(listOfValidRecipes);
		}, 1000);
	}
}