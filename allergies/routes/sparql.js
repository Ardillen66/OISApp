var express = require('express');
var router = express.Router();
var sparqlEngine = require('../public/javascripts/sparql-engine.js')

/* GET sparql endpoint */
router.get('/', function(req, res, next) {
	//SPARQL engine starts listening
  	res.render('sparql');
});

module.exports = router;