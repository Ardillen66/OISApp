	var express = require('express'),
	    exphbs  = require('express3-handlebars'),
	    passport = require('passport'),
	    LocalStrategy = require('passport-local'),
	    fs = require("fs"),
	    file = "CSdatabase.db",
	    exists = fs.existsSync(file),
	    sqlite3 = require("sqlite3").verbose(),
	    db = new sqlite3.Database(file),
	    bodyParser = require('body-parser'),
	    cookieParser = require('cookie-parser'),
	    session = require('express-session'),
	    app = express(),
	    db_scripts = require('./db_scripts');

	//===============EXPRESS=================

	app.use(cookieParser());
	app.use(bodyParser.json());       // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	}));

	app.use(session({ secret: 'anything', resave: false, saveUninitialized: false }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
	   res.header("Access-Control-Allow-Origin", "*");
	   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   next();
	});

	var hbs = exphbs.create({
	    defaultLayout: 'main',
	});
	app.engine('handlebars', hbs.engine);
	app.set('view engine', 'handlebars');

	app.use(session({ secret: 'anything', resave: false, saveUninitialized: false }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
	   res.header("Access-Control-Allow-Origin", "*");
	   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   next();
	});

	//===============PASSPORT=================

	passport.use('local', new LocalStrategy(function(email, password, done) {
		console.log("test");
	  db_scripts.authenticateUser(email,password,function(user) {
	      if (user == null) return done(null, false);
	      return done(null, user);
	  });
	}));

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null,obj);
	});

	//===============ROUTES=================

	//displays homepage
	app.get('/', function(req, res){
	  res.render('home', {user: req.user});
	});

	//signs-out user
	app.get('/sign-out', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	//logs in existing user and displays logged-in page
	app.post('/sign-in', function(req, res) {
	  passport.authenticate('local', function (err, user) {
	    if (!user) {
	      return res.render('home', {page:'/sign-in', signinError: "Invalid username and/or password, please try again"});
	    };
	    req.logIn(user, function(err) {
	     return res.redirect('/');
	    });
	  })(req, res);
	});

	//adds new user and displays registered page
	app.post('/registered',function(req,res) {
	  var email=req.body.email,
	      password=req.body.password,
	      password2=req.body.password2,
	      professional;
	  if (req.body.professional == "on") {professional=true} else {professional=false};
	  db_scripts.registerCheck(email, password, password2, function(reg) {
	    if (reg == true) {
	      db_scripts.insertNewUser(email,password,professional);
	      res.render('registered', {page:'/registered',email});
	    } else {
	      var regError = {email:"", emailError:"", passwordError:""};
	      if (reg[0] != email) {
	        regError.emailError = reg[0];
	      } else {
	        regError.email=email;
	        regError.passwordError = reg[1];
	      }
	      res.render('home', {page:'/registered',regError});
	    }
	  });
	});

	//edits user account information in database
	app.post('/editAccount',function(req,res) {
	  var password=req.body.password,
	      password2=req.body.password2,
	      email=req.body.email2,
	      fname=req.body.fname,
	      lname=req.body.lname,
	      sex=req.body.sex,
	      bday=req.body.bday,
	      country=req.body.country,
	      fbUrl=req.body.fburl,
	      uid=req.user.id;
	  editAccCheck(password, password2, email, fname, lname, sex, bday, country, fbUrl, uid, function(reg) {
	    if (reg == true) {
	      editAccount(uid,password,email, fname, lname, sex, bday, country, fbUrl);
	      res.render('home', {user: req.user});
	    } else {
	      var editError = {email:"", fname:"", lname:"", sex:"", bday:"", country:"", fbUrl:"", emailError:"", passwordError:""};
	      if (reg[0] != email) {
	        editError.emailError = reg[1];
	      } else {
	        editError.email=email;
	      }
	      if (reg.length == 2) {
	        editError.passwordError = reg[2];
	      }
	        editError.fname=fname;
	        editError.lname=lname;
	        editError.sex=sex;
	        editError.bday=bday;
	        editError.country=country;
	        editError.fbUrl=fbUrl;
		console.log(editError);
	      res.render('home', {page:'/editAccount', editError, user: req.user});
	    }
	  });
	});

	//loads user profile information from database
	app.get('/getProfileInfo', function(req,res){
	  db.get("SELECT username, email, fName, lName, birthday, facebookLink, country, sex FROM users WHERE id = '"+ req.query.uid + "'",
	    function(err, data) {
	      res.send(data);
	    }
	  );
	})

	//gets username from user ID in database
	app.get('/getUsername', function(req,res){
	  db.get("SELECT username FROM users WHERE id = '"+ req.query.uid + "'",
	    function(err, data) {
	      res.send(data);
	    }
	  );
	})

	//===============SERVER=================

	var server = app.listen(3000, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Foodology: http://127.0.0.1:'+port);
	});
