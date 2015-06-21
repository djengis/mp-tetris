'use strict';


/**
 * Api für Datenbank Zugriffen.
 * @module server
 * @namespace server
 * @class Api
 * @constructor
 * @param {server.Server} gameServer
 */
function Api(gameServer){

	/**
	 * Instanz von Server
	 *
	 * @property _gameServer
	 * @type server.Server
	 * @private
	 */
	this._gameServer = gameServer;
	
	/**
	 * Keys sind String, die die angeforderten Daten beschreiben.
	 * Values sind Funktionen, die die angeforderten Daten der Keys aus der Datenbank holen
	 *
	 * @property _bindings
	 * @private
	 * @type Map
	 */
	this._bindings = {}
		
	this._bindings['/api/profil'] = [
		{
			"type": "get",
			"url": "",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
			
				// Alle Profile
				var sqlProfil = ""
				+ " SELECT Profil.ProfilID, "
				+ "        Profil.Name, "
				+ "        Profil.AnmeldeDatum, "
				+ "        Profil.LetzteAnmeldung, "
				+ "        Highscore.Punkte, "
				+ "        Highscore.GesetzteBloecke "
				+ " FROM Profil "
				+ " LEFT JOIN Highscore ON Profil.ProfilID = Highscore.ProfilID "
				+ " ORDER BY Profil.ProfilID "
				+ " ;";
			
				db.query(sqlProfil, [], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result);	
				});
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/length",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
			
				var sqlProfil = ""
				+ " SELECT COUNT(ProfilID) as count "
				+ " FROM Profil "
				+ " ;";
			
				db.query(sqlProfil, [], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result[0]);	
				});
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/isonline/:profil_id",
			"func": function(req, res) {
				var id = parseInt(req.params.profil_id);
				var profil = this._gameServer.getProfilById(id);
				if(!profil){
					res.statusCode = 500;
					res.json(false);	
				}
				res.json(profil.isOnline());	
			}.bind(this)
		},
		{
			"type": "get",
			"url": '/:von-:bis',
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				

				var offset = parseInt(req.params.von) -1;
				var limit = parseInt(req.params.bis)+1 - parseInt(req.params.von);
				if (limit < 0)
					limit = 1;
				// Spezielles Profil
				var sqlProfil = ""
				+ " SELECT Profil.ProfilID, "
				+ "        Profil.Name, "
				+ "        Profil.AnmeldeDatum, "
				+ "        Profil.LetzteAnmeldung, "
				+ "        Highscore.Punkte, "
				+ "        Highscore.GesetzteBloecke "
				+ " FROM Profil"
				+ " NATURAL JOIN Highscore "
				+ " ORDER BY Profil.ProfilID "
				+ " LIMIT ? "
				+ " OFFSET ? "
				+ " ;";
				
				db.query(sqlProfil, [limit, offset], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result);	
				});
			}.bind(this)
		},
		{
			"type": "get",
			"url": '/:profil_id',
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				// Spezielles Profil
				var sqlProfil = ""
				+ " SELECT Profil.ProfilID, "
				+ "        Profil.Name, "
				+ "        Profil.AnmeldeDatum, "
				+ "        Profil.LetzteAnmeldung, "
				+ "        Highscore.Punkte, "
				+ "        Highscore.GesetzteBloecke "
				+ " FROM Profil"
				+ " NATURAL JOIN Highscore "
				+ " WHERE Profil.ProfilID = ? "
				+ " ;";
			
				db.query(sqlProfil, [req.params.profil_id], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					if(result.length==1)
						res.json(result[0]);	
					else
						res.json(null);	
				});
			}.bind(this)
		},
		{
			"type": "get",
			"url": '/byname/:profil_name',
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var sqlProfil = ""
				+ " SELECT Profil.ProfilID, "
				+ "        Profil.Name, "
				+ "        Profil.AnmeldeDatum, "
				+ "        Profil.LetzteAnmeldung "
				+ " FROM Profil"
				+ " WHERE Profil.Name LIKE ? LIMIT 1"
				+ " ;";
				
				db.query(sqlProfil, [req.params.profil_name], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					if(result.length==1)
						res.json(result[0]);	
					else
						res.json(null);
				});	
				
			}.bind(this)
		},
		{
			"type": "get",
			"url": '/:profil_id/spiele',
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				// Spezielles Profil
				var sqlProfil = ""
				+ " SELECT SpielID, "
				+ "        ProfilID, "
				+ "        Dauer, "
				+ "        MaxProfil, "
				+ "        Datum, "
				+ "        SpielTypID, "
				+ "        Bezeichnung AS SpielTypBezeichnung, "
				+ "        Class AS SpielTypClass "
				+ " FROM Spiel"
				+ " NATURAL LEFT JOIN SpielTyp "
				+ " WHERE Spiel.ProfilID = ? "
				+ " ;";
				
				db.query(sqlProfil, [req.params.profil_id], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result);	
				});	
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/:profil_id/spiele/:spielTypClass",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var spielTypClass = req.params.spielTypClass;
				var profil_id = req.params.profil_id;
				
				// Spezielles Profil
				var sqlProfil = ""
				+ " SELECT SpielID, "
				+ "        ProfilID, "
				+ "        Dauer, "
				+ "        MaxProfil, "
				+ "        Datum, "
				+ "        SpielTypID, "
				+ "        Bezeichnung AS SpielTypBezeichnung, "
				+ "        Class AS SpielTypClass "
				+ " FROM Spiel"
				+ " NATURAL JOIN SpielTyp "
				+ " WHERE SpielTyp.Class = ? "
				+ " AND ProfilID = ? "
				+ " ;";
				
				db.query(sqlProfil, [[spielTypClass,profil_id]], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result);	
				});	
			}.bind(this)
		},
		{
			"type": "put",
			"url": '/:profil_id',
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				var id = req.params.profil_id;
		
				var newName = req.body.Name;
			
				var sqlProfil = ""
				+ " UPDATE Profil "
				+ " SET Name= ? "
				+ " WHERE ProfilID = ? "
				+ ";";
					
				db.query(sqlProfil, [newName, id], function(err, result){
					if(err){
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.json(result[0]);	
				});	
			}.bind(this)
		},
		{
			"type": "post",
			"url": "",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				var newName = req.body.Name;
		
				var sqlProfil = ""
				+ " INSERT INTO Profil "
				+ " SET Name = ?"
				+ ";";
		
				db.query(sqlProfil, [newName], function(err, result){
			   		if(err){ 
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.statusCode = 201;
					res.send();	
				});	
			}.bind(this)
		},
		{
			"type": "delete",
			"url": '/:profil_id',
			"func": function(req, res){	
				var db = this._gameServer.getDB();
		
				var id = req.params.profil_id;
		
				var sqlProfil = ""
				+ " DELETE FROM Profil"
				+ " WHERE ProfilID = ?"
				+ " ;";
				db.query(sqlProfil, [id], function(err, result){
					if(err){
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					res.statusCode = 200;
					res.send();
				});	
			}.bind(this)
		}
	];
	
	this._bindings['/api/highscore'] = [
		{
			"type": "get",
			"url": "/",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				var rank = 1;
				var sqlScore = ""
					+ " SELECT	ProfilID, "
					+ " 		Name, "
					+ "			LetzteAnmeldung, "
					+ " 		Spieleanzahl, "
					+ "			Gesamtdauer, "
					+ "			Punkte, "
					+ "			GesetzteBloecke, "
					+ "			Tastenanschlaege "
					+ " FROM Highscore "
					+ " ORDER BY Punkte DESC ";
				db.query(sqlScore, [], function(err, result){
					if(err){
						res.statusCode = 500;
						res.json(null);
						return;
					}
					var i;
					for (i = 0; i <= result.length; i++){
						if (result[i] != undefined){
							result[i].Platz = rank;
							rank += 1;
						}
					}
					res.json(result);
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/types",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var sqlScore = ""
							+ " SELECT Bezeichnung"
							+ " FROM SpielTyp;";
				db.query(sqlScore, [], function(err, result){
					if(err){
						res.statusCode = 500;
						res.json(null);
						return;
					}
					res.json(result);
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/length/*",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var arr =  [];
				var p = req.params[0].split(/[/-]/); // splitte bei / und -
				var typ = p[p.length -1];
				
				if (0 < typ.length && typ != '_'){
					var sqlScore = ""
					+ " SELECT COUNT(ProfilID) AS count"
					+ " FROM HighscoreSpielTyp AS h"
					+ " INNER JOIN SpielTyp ON h.SpielTyp = SpielTyp.SpielTypID "
					+ " WHERE SpielTyp.Bezeichnung = ?"		
					+ ";"; 
					arr.push(typ);
				}else{
					var sqlScore = ""
					+ " SELECT	COUNT(*) AS count"
					+ " FROM Highscore;";
				}
				db.query(sqlScore, arr, function(err, result){
					if(err){
						res.statusCode = 500;
						res.json(null);
						return;
					}
					res.json(result[0]);
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/:typ/:von-:bis",
			"func": function(req, res) {
				var db = this._gameServer.getDB();

				var typ = req.params.typ;
				var von = parseInt(req.params.von);
				var bis = parseInt(req.params.bis);
				
				var	offset = " OFFSET " + (von-1);
				var rank = von;
				var limit = " LIMIT " + (bis+1 - von);
				
				// sql erstellen		
				var arr = [];
				var sqlScore = null;
				
				if(typ !== undefined && 0 < typ.length && typ != '_'){
					sqlScore = ""
					+ "SELECT ProfilID, "
					+ " 		Name, "
					+ "			LetzteAnmeldung, "
					+ " 		Spieleanzahl, "
					+ "			Gesamtdauer, "
					+ "			Punkte, "
					+ "			GesetzteBloecke, "
					+ "			Tastenanschlaege "
					+ " FROM HighscoreSpielTyp AS h"
					+ " INNER JOIN SpielTyp ON h.SpielTyp = SpielTyp.SpielTypID "
					+ " WHERE SpielTyp.Bezeichnung like ?"
					+ " ORDER BY Punkte DESC ";
					arr.push(typ);
				}else{
					sqlScore = ""
					+ " SELECT	ProfilID, "
					+ " 		Name, "
					+ "			LetzteAnmeldung, "
					+ " 		Spieleanzahl, "
					+ "			Gesamtdauer, "
					+ "			Punkte, "
					+ "			GesetzteBloecke, "
					+ "			Tastenanschlaege "
					+ " FROM Highscore "
					+ " ORDER BY Punkte DESC ";
				}
				sqlScore += limit + offset;
				db.query(sqlScore, arr, function(err, result){
					if(err){
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					var i;
					for (i = 0; i <= result.length; i++){
						if (result[i] != undefined){
							result[i].Platz = rank;
							rank += 1;
						}
					}
					res.json(result);		
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/:von-:bis",
			"func": function(req, res) {
				var db = this._gameServer.getDB();

				var von = parseInt(req.params.von);
				var bis = parseInt(req.params.bis);
				
				var	offset = von-1;
				var rank = von;
				var limit = bis+1 - von;
				
				// sql erstellen		
				var sqlScore = ""
					+ " SELECT	ProfilID, "
					+ " 		Name, "
					+ "			LetzteAnmeldung, "
					+ " 		Spieleanzahl, "
					+ "			Gesamtdauer, "
					+ "			Punkte, "
					+ "			GesetzteBloecke, "
					+ "			Tastenanschlaege "
					+ " FROM Highscore "
					+ " ORDER BY Punkte DESC "
					+ " LIMIT ? OFFSET ?;" ;
				db.query(sqlScore, [limit, offset], function(err, result){
					if(err){
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					var i;
					for (i = 0; i < result.length; i++){
						result[i].Platz = rank;
						rank += 1;
					}
					res.json(result);		
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/:typ/:von",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var von = parseInt(req.params.von);
				var typ = req.params.typ;
				var offset = " OFFSET " + (von-1);
				var rank = von;
				var	limit = " LIMIT 1";
				
				// sql erstellen		
				var arr = [];
				var sqlScore = null;
				
				sqlScore = ""
					+ "SELECT ProfilID, "
					+ " 		Name, "
					+ "			LetzteAnmeldung, "
					+ " 		Spieleanzahl, "
					+ "			Gesamtdauer, "
					+ "			Punkte, "
					+ "			GesetzteBloecke, "
					+ "			Tastenanschlaege "
					+ " FROM HighscoreSpielTyp AS h"
					+ " INNER JOIN SpielTyp ON h.SpielTyp = SpielTyp.SpielTypID "
					+ " WHERE SpielTyp.Bezeichnung like ?"
					+ " ORDER BY Punkte DESC ";
					arr.push(typ);
				sqlScore += limit + offset;
				db.query(sqlScore, arr, function(err, result){
					if(err){
						res.statusCode = 500;
						res.send(err);	
						return;
					}
					result[0].Platz = rank;
					res.json(result[0]);		
				});
				return;
			}.bind(this)
		},
		{
			"type": "get",
			"url": "/:typ",
			"func": function(req, res) {
				var db = this._gameServer.getDB();
				
				var rank = 1;
				var	typ = req.params.typ;
				var von = parseInt(typ);
				
				if (!isNaN(von)){
					sqlScore = ""
						+ " SELECT	ProfilID, "
						+ " 		Name, "
						+ "			LetzteAnmeldung, "
						+ " 		Spieleanzahl, "
						+ "			Gesamtdauer, "
						+ "			Punkte, "
						+ "			GesetzteBloecke, "
						+ "			Tastenanschlaege "
						+ " FROM Highscore "
						+ " ORDER BY Punkte DESC "
						+ " LIMIT 1 OFFSET ?;" ;
					db.query(sqlScore, [(von-1)], function(err, result){
						if(err){
							res.statusCode = 500;
							res.send(err);	
							return;
						}
						result[0].Platz = von;
						res.json(result[0]);		
					});	
				}else{
					// sql erstellen
					var sqlScore = ""
						+ "SELECT ProfilID, "
						+ " 		Name, "
						+ "			LetzteAnmeldung, "
						+ " 		Spieleanzahl, "
						+ "			Gesamtdauer, "
						+ "			Punkte, "
						+ "			GesetzteBloecke, "
						+ "			Tastenanschlaege "
						+ " FROM HighscoreSpielTyp AS h"
						+ " INNER JOIN SpielTyp ON h.SpielTyp = SpielTyp.SpielTypID "
						+ " WHERE SpielTyp.Bezeichnung like ?"
						+ " ORDER BY Punkte DESC ";
				
					db.query(sqlScore, [typ], function(err, result){
						if(err){
							res.statusCode = 500;
							res.send(err);	
							return;
						}
						var i;
						for (i = 0; i <= result.length; i++){
							if (result[i] != undefined){
								result[i].Platz = rank;
								rank += 1;
							}
						}
						res.json(result);		
					});
				}
			}.bind(this)
		}];
	
	this._bindings['/api/statistics'] = [
		{
			"type": "get",
			"url": "",
			"func": function(req, res) {
			
				var profils = this._gameServer.getAllProfils();
				var c_online = 0;
				for(var i in profils){
					var profil = profils[i];
					if(profil.isOnline()){
						c_online+=1;
					}
				}
				
				var spiele = this._gameServer.getAllGames();
				var c_spiele = 0;
				for(var i in spiele){
					var spiel = spiele[i];
					if(spiel.isRunning()){
						c_spiele+=1;
					}
				}
				
				res.json({
					"online": c_online,
					"spiele": c_spiele,
					"uptime": process.uptime()
				});
				
			}.bind(this)
		}
	];


}

/**
 * @method getBindings
 *
 * @return Map
 */
Api.prototype.getBindings = function(){
	return this._bindings;
};

exports.Api = Api;
