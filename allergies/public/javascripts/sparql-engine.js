var sparql = require('sparql');
var fs = require('fs');
var rdfstore = require('rdfstore');

dbpedia = new sparql.Client('http://dbpedia.org/sparql')
//foodExt = new sparql.Client() TODO: add external data set

var localStore = new rdfstore.Store({persistent:true, 
                engine:'mongodb', 
                name:'myappstore', // quads in MongoDB will be stored in a DB named myappstore
                overwrite:true,    // delete all the data already present in the MongoDB server
                mongoDomain:'localhost', // location of the MongoDB instance, localhost by default
                mongoPort:27017 // port where the MongoDB server is running, 27017 by default
               }, function(store){
var rdf1 = fs.readFileSync('C:/Users/arnau/Downloads/Food Ontology.owl').toString();

store.load("text/turtle", rdf1, function(s, d) {


 store.execute("SELECT * WHERE { ?s ?p ?o } LIMIT 10", function(success, results){
  console.log(success, results);
     });
      });
 });



//Example query
// client.query 'select * where { ?s ?p ?o } limit 100', (err, res) ->
//   console.log res

//Function that takes a string representing a SPARQL query to our endpoint and returns the results
function handleQuery(query){
	//Handle query and access rdfstore here

}