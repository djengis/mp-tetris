"use strict";

var Util = require('./../global/Util.js').Util;
//var Q = require('q'); see http://old.erickrdch.com/2012/07/nodejs-and-mysql.html

/**
 * Klasse zum Erstellen und Verwalten der Datenbank
 *
 * @module server
 * @namespace server
 * @class Database
 * @constructor
 * @param {String} host der zu verbindende Host
 * @param {String} user der Benutzername des Datenbankservers
 * @param {String} password das Passwort des Benutzers
 */
function Database(host, user, password){
	/**
	 * @property _mysql
	 * @type mysql
	 * @private
	 */
	this._mysql = require('mysql');
	
	/**
	 * @property _conn
	 * @type Connection
	 * @private
	 */
	this._conn = this._connectDB(host, user, password);
}

/**
 * @method escape
 *
 * @param {String} value
 * @return 
 */
Database.prototype.escape = function(value){
	return this._mysql.escape(value);
}

/**
 * Durchreichen zum query.
 *
 * @method query
 * @async
 * @param {String} sql
 * @param {Array} params
 * @param {Function} callback
 */
Database.prototype.query = function(sql, params, callback){
	if(params.length !== 0 && params[0] !== undefined && params[0].length){
		for(var i in params){
			this._conn.query(sql, params[i], callback);
		}
	}else{
		this._conn.query(sql,params, callback);
	}
};

/**
 * Erstellt die Datenbankverbindung.
 *
 * @method _connectDB
 * @private
 * @async
 * @param {String} host der zu verbindende Host
 * @param {String} user der Benutzername des Datenbankservers
 * @param {String} password das Passwort des Benutzers
 * @return die Verbindung
 */
Database.prototype._connectDB = function(host, user, password){

	var conn = new this._mysql.createConnection({
	    host     : host,
	    user     : user,
	    password : password
	});
	
	conn.connect(function(err) {
	    if(err){
	        console.log("ERROR: Konnte nicht mit dem MySQL-Server verbinden. Läuft dieser?\n");
	    	console.log(err);
	        process.exit(1);
	    }
	});
		
	return conn;
};

/**
 * Erstellt die Datenbank, falls diese noch nicht existiert.
 * 
 * @method connectDatabase
 *
 * @param {String} database der Name der Datenbank
 * @param {Boolean} create_database gibt an, ob die Datenbank und dessen Daten inkl. Testdaten erstellt werden soll
 */
Database.prototype.connectDatabase = function(database, create_database){
	if(create_database === undefined){
		create_database = true;
	}

	var drop = 'DROP DATABASE IF EXISTS '+database+'; ';
	var create = 'CREATE DATABASE IF NOT EXISTS '+database+' CHARACTER SET utf8 COLLATE utf8_unicode_ci; ';
	var sqlUse = 'USE '+database;
	
	var sqlProfil = ""
	+ "CREATE TABLE IF NOT EXISTS Profil("
	+ " ProfilID INT NOT NULL AUTO_INCREMENT, "
	+ " Name VARCHAR(30) NOT NULL UNIQUE KEY, "
	+ " AnmeldeDatum TIMESTAMP NOT NULL DEFAULT NOW(), "
	+ " LetzteAnmeldung TIMESTAMP, "
	+ " PRIMARY KEY(ProfilID) "
	+ ") ENGINE=InnoDB;";
	
	var sqlScore = ""
	+ "CREATE TABLE IF NOT EXISTS Score("
	+ " ProfilID INT NOT NULL REFERENCES Profil(ProfilID), "
	+ " SpielID INT NOT NULL REFERENCES Spiel(SpielID), "
	+ " Punkte INT NOT NULL DEFAULT 0, "
	+ " GesetzteBloecke INT NOT NULL DEFAULT 0, "
	+ " Tastenanschlaege INT NOT NULL DEFAULT 0, "
	+ " PRIMARY KEY(ProfilID, SpielID) "
	+ ") ENGINE=InnoDB;";
	
	var sqlSpiel = ""
	+ "CREATE TABLE IF NOT EXISTS Spiel("
	+ " SpielID INT NOT NULL AUTO_INCREMENT, "
	+ " MaxProfil INT NOT NULL DEFAULT 4, "
	+ " Dauer INT NOT NULL DEFAULT 0, "
	+ " SpielTypID INT NOT NULL REFERENCES SpielTyp(SpielTypID), " 
	+ " ProfilID INT NOT NULL REFERENCES Profil(ProfilID), " // Profil, das das Spiel erstellt hat.
	+ " Statistiken TEXT, "
	+ " Datum TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "
	+ " PRIMARY KEY(SpielID) "
	+ ") ENGINE=InnoDB;";
	
	var sqlSpielTyp = ""
	+ "CREATE TABLE IF NOT EXISTS SpielTyp("
	+ " SpielTypID INT NOT NULL AUTO_INCREMENT, "
	+ " Bezeichnung VARCHAR(30) NOT NULL, "
	+ " Class VARCHAR(30) NOT NULL, "
	+ " PRIMARY KEY(SpielTypID) "
	+ ") ENGINE=InnoDB;";
	
	var sqlProfil_Spielt_Spiel = ""
	+ "CREATE TABLE IF NOT EXISTS Profil_Spielt_Spiel("
	+ " ProfilID INT NOT NULL REFERENCES Profil(ProfilID), "
	+ " SpielID INT NOT NULL REFERENCES Spiel(SpielID), "
	+ " PRIMARY KEY(ProfilID, SpielID) "
	+ ") ENGINE=InnoDB;";
	
	var sqlHigscore = ""
	+ "CREATE VIEW Highscore AS ("
	+ " SELECT Profil.ProfilID, "
	+ "        Profil.Name, "
	+ "        Profil.LetzteAnmeldung, "
	+ "        COUNT(Spiel.SpielID) AS Spieleanzahl, "
	+ "        SUM(Spiel.Dauer) AS Gesamtdauer, "
	+ "        SUM(Score.Punkte) AS Punkte, "
	+ "        SUM(Score.GesetzteBloecke) AS GesetzteBloecke, "
	+ "        SUM(Score.Tastenanschlaege) AS Tastenanschlaege "
	+ " FROM Score "
	+ " RIGHT JOIN Spiel ON Score.SpielID = Spiel.SpielID "
	+ " RIGHT JOIN Profil ON Profil.ProfilID = Score.ProfilID "
	+ " GROUP BY Profil.ProfilID"
	+ ");";

	var sqlHigscore_SpielTyp = ""
	+ "CREATE VIEW HighscoreSpielTyp AS ("
	+ " SELECT Profil.ProfilID, "
	+ "        Profil.Name, "
	+ "        Profil.LetzteAnmeldung, "
	+ " 	   Spiel.SpielTypID AS SpielTyp, "
	+ "        COUNT(Spiel.SpielID) AS Spieleanzahl, "
	+ "        SUM(Spiel.Dauer) AS Gesamtdauer, "
	+ "        SUM(Score.Punkte) AS Punkte, "
	+ "        SUM(Score.GesetzteBloecke) AS GesetzteBloecke, "
	+ "        SUM(Score.Tastenanschlaege) AS Tastenanschlaege "
	+ " FROM Score "
	+ " RIGHT JOIN Spiel ON Score.SpielID = Spiel.SpielID "
	+ " RIGHT JOIN Profil ON Profil.ProfilID = Score.ProfilID "
	+ " GROUP BY Profil.ProfilID, Spiel.SpielTypID"
	+ ");";
	
	var sqlInsertProfil = "INSERT INTO Profil SET ProfilID = ?, Name = ?;";
	var sqlInsertSpielTyp = "INSERT INTO SpielTyp SET SpielTypID = ?, Bezeichnung = ?, Class = ?;";
	var sqlInsertSpiel = "INSERT INTO Spiel SET SpielTypID = ?, ProfilID = ?, Dauer = ?;";
	var sqlInsertScore = "INSERT INTO Score SET ProfilID = ?, SpielID = ?, Punkte = ?, GesetzteBloecke = ?, Tastenanschlaege = ?;";
	var sqlInsertProfil_Spiel = "INSERT INTO Profil_Spielt_Spiel SET ProfilID = ?, SpielID = ?;";

	
	if(create_database){
		this.query(drop, function (err) { if(err) throw err; });
		this.query(create, function (err) { if(err) throw err; });
		this.query(sqlUse, function (err) { if(err) throw err; });
		this.query(sqlProfil, function(err){ if(err) throw err; });
		this.query(sqlScore, function(err){ if(err) throw err; });
		this.query(sqlSpiel, function(err){ if(err) throw err; });
		this.query(sqlSpielTyp, function(err){ if(err) throw err; });
		this.query(sqlProfil_Spielt_Spiel, function(err){ if(err) throw err; });
		this.query(sqlHigscore, function(err){ if(err) throw err; });
		this.query(sqlHigscore_SpielTyp, function(err){ if(err) throw err; });
		
		// Exampledata

		//Profil-Angaben (ProfilID, Name)
		var profilDaten = [
			[1, "Anna"],
			[2, "Nici"],
			[3, "Cengiz"],
			[4, "Peter"],
			[5, "Maggi"],
			[6, "Lui"],
			[7, "Johannes"],
			[8, "Tobi"],
			[9, "Tim"],
			[10, "Jana"],
			[11, "Julia"],
			[12, "Susi"],
			[13, "Rudi"],
			[14, "Hartweizen"],
			[15, "John Schnee"],
			[16, "Ned Stark"],
			[17, "Kevin"],
			[18, "Jeromy"],
			[19, "Chris"],
			[20, "Coraline"],
			[21, "Julian"],
			[22, "Luna"],
			[23, "Loriot"],
			[24, "Kahl Drogo"],
			[25, "Schattenwolf"],
			[26, "Krasus"],
			[27, "Lena"],
			[28, "Robin"],
			[29, "Veressa"],
			[30, "Caroline"],
		];
		this.query(sqlInsertProfil, profilDaten);
		

		//SpielTyp-Angaben (SpielTypID, Bezeichnung, Class)
		var spielTypDaten = [
			[1, "Spiel auf Zeit", "SpielAufZeit"],
			[2, "Deathmatch", "none"],
			[3, "Last Man Standing", "none"],
		];
		this.query(sqlInsertSpielTyp, spielTypDaten);
		
		
		var spielDaten = [];
		var scoreDaten = [];
		var profil_spieltDaten = [];
		var proID;
		var spielID;
		for(var i = 0; i < 500; i++){
			//Spiel-Angaben (SpielTypID, ProfilID, Dauer)
			spielDaten.push([Util.randInteger(1, spielTypDaten.length+1), Util.randInteger(1, profilDaten.length), Util.randInteger(0,600)]);
			
			var o = [];
			for(var j = 0; j < Util.randInteger(1,4); j++){
				
				do{
					proID = Util.randInteger(1, profilDaten.length+1);
				}while(Util.inArray(o, proID));
				
				o.push(proID);
				spielID = i+1;
				
				
				//Score-Angaben (ProfilID, SpielID, Punkte, gesetzte Bloecke, Tastenanschlaege)
				scoreDaten.push([proID, spielID, Util.randInteger(0,100000), Util.randInteger(0,1000), Util.randInteger(0,3000)]);
				
				//Profil_Spielt_Spiel-Angaben (ProfilID, SpielID)
				profil_spieltDaten.push([proID, spielID]);
			}
		}
		this.query(sqlInsertSpiel, spielDaten);
		this.query(sqlInsertScore, scoreDaten);
		this.query(sqlInsertProfil_Spiel, profil_spieltDaten);
		

	}else{
		this.query(sqlUse, function (err) {});
	}
};

exports.Database = Database;
