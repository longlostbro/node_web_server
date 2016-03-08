
var request = require('request');
var fs = require('fs');
var base_url = "http://pokeapi.co/api/v2/";
var pokemon={};
var getPokemonInfo = function(number)
{
	if(number < 151)
	{
		request(base_url+"pokemon/"+number, function (error, response, body) {
			if(error){
				console.log("error: "+error);
				return;
			}
			body = JSON.parse(body);
			pokemon[number]={};
	    	pokemon[number].id=body.id;
	    	pokemon[number].name=body.name;
	    	var abilities=[];
	    	for(var key in body.abilities)
	    	{
	    		abilities[key]=body.abilities[key].ability.name
	    	}
	    	pokemon[number].abilities=abilities;
	    	var moves=[];
	    	for(var key in body.moves)
	    	{
	    		moves[key]=body.moves[key].move.name
	    	}
	    	pokemon[number].moves=moves;
	    	pokemon[number].stats=body.stats;
	    	pokemon[number].types=body.types;
	    	pokemon[number].gif_url="/pokemon/"+('000'+body.id).slice(-3)+".gif";
	    	request(base_url+"evolution-chain/"+number, function (error, response, newbody) {
				if(error){
					console.log("error: "+error);
					return;
				}
				var evolution = JSON.parse(newbody);
				pokemon[number].evolves_to=evolution.chain.species.name;
		    	console.log("no "+number+" complete.");
		    	getPokemonInfo(number+1);
			});
		});
	}
	else if(number == 151)
	{
		request(base_url+"pokemon/"+number, function (error, response, body) {
			if(error){
				console.log("error: "+error);
				return;
			}
			body = JSON.parse(body);
	    	pokemon[number]={};
	    	pokemon[number].id=body.id;
	    	pokemon[number].name=body.name;
	    	var abilities=[];
	    	for(var key in body.abilities)
	    	{
	    		abilities[key]=body.abilities[key].ability.name
	    	}
	    	pokemon[number].abilities=abilities;
	    	var moves=[];
	    	for(var key in body.moves)
	    	{
	    		moves[key]=body.moves[key].move.name
	    	}
	    	pokemon[number].moves=moves;
	    	pokemon[number].stats=body.stats;
	    	pokemon[number].types=body.types;
	    	pokemon[number].gif_url="/pokemon/"+('000'+body.id).slice(-3)+".gif";
	    	request(base_url+"evolution-chain/"+number, function (error, response, newbody) {
				if(error){
					console.log("error: "+error);
					return;
				}
				var evolution = JSON.parse(newbody);
				pokemon[number].evolves_to=evolution.chain.species.name;
		    	console.log("no "+number+" complete.");
		    	fs.writeFile('newpokemon.json', JSON.stringify(pokemon), function (err,data) {
				  	if (err) {
				    	return console.log(err);
				  	}
				  	console.log("complete");
				});
			});
		});
	}
}
getPokemonInfo(1);
