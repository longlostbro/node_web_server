var path = require('path');
var request = require('request');
var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";
var port = 3001;
var args = process.argv.slice(2);
if(args.length == 2)
{
	port = Number(args[0]);
	ROOT_DIR = args[1];
}
var server = http.createServer(function (req, res) {
var urlObj = url.parse(req.url, true, false);
processRequest(res,urlObj);
}).listen(port,function(e){
  if(e != undefined)
	 console.error(e);
	return;
});
console.log("Server listening on port "+port);
console.log("Serving file from root "+ROOT_DIR);
var processRequest = function(res, urlObj)
{
  console.log("'"+urlObj.pathname+"'");
  if(urlObj.pathname.indexOf("getcity") !=-1) 
  {
    // Execute the REST service 
    console.log("In REST Service");
    console.log("dir: "+path.resolve('cities.dat.txt'));
    fs.readFile('cities.dat.txt', function (err, data) {
    if(err){
      console.log('error reading file');
      return;
    }
    var myRe = new RegExp("^"+urlObj.query["q"]);
    console.log(myRe);
    cities = data.toString().split("\n");
    var jsonresult = [];
    for(var i = 0; i < cities.length; i++) {
      var result = cities[i].search(myRe); 
      if(result != -1) {
        console.log(cities[i]);
        jsonresult.push({city:cities[i]});
      } 
    }   
    console.log(JSON.stringify(jsonresult));
    res.writeHead(200);
    res.end(JSON.stringify(jsonresult));
  });
  } 
  else if(urlObj.pathname.indexOf("getpokemon") !=-1) 
  {
    // Execute the REST service 
    console.log("In REST Service");
    console.log("dir: "+path.resolve('pokemon.json'));
    fs.readFile('newpokemon.json', function (err, data) {
	    if(err){
	      console.log('error reading file');
	      return;
	    }
	    res.writeHead(200);
	    var num = urlObj.query["q"];
	    var pokemon = JSON.parse(data);
	    res.end(JSON.stringify(pokemon[num]));
  	});
  }
  else if(urlObj.pathname.indexOf("/pokemon/") !=-1)
  {
  	urlObj.pathname = urlObj.pathname.slice(1);
	  	fs.exists(urlObj.pathname, function(exists) {
		    if(!exists) {
		    	console.log("can't find: "+urlObj.pathname);
			      res.writeHead(404, {"Content-Type": "text/plain"});
			      res.write("404 Not Found\n");
			      res.end();
			      return;
		    }

		    if (fs.statSync(urlObj.pathname).isDirectory()) urlObj.pathname += '/index.html';

		    fs.readFile(urlObj.pathname, "binary", function(err, file) {
			      if(err) {        
			        res.writeHead(500, {"Content-Type": "text/plain"});
			        res.write(err + "\n");
			        res.end();
			        return;
			      }

			      res.writeHead(200);
			      res.write(file, "binary");
			      res.end();
		    });
	  });
  }
  else
  {
  	console.log(urlObj);
    if(urlObj.pathname == "/")
    {
      urlObj.pathname = "/index.html";
    }
    fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
      if (err) {
        console.log("error 404");
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}