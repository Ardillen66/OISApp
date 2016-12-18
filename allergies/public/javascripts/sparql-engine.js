var sparql = require('sparql');
var fs = require('fs');

dbpedia = new sparql.Client('http://dbpedia.org/sparql')
//foodExt = new sparql.Client() TODO: add external data set

//Example query
// client.query 'select * where { ?s ?p ?o } limit 100', (err, res) ->
//   console.log res

//Function that takes a string representing a SPARQL query to our endpoint and returns the results
function handleQuery(query){
	//Handle query and access rdfstore here
  localStore.execute()

}