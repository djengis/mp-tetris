"use strict";

/**
 * Pattern für Zeitangabe
 *
 * @module global
 * @namespace global
 * @class pre_defs
 * @static
 * @readOnly
 */
var pre_defs = {
	"timestampPattern":  {
		"type": "string",
		"pattern": "^[0-9]{4}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.*$"
	},
};

/**
 * Die SCHEMAs der API.
 *
 * @module global
 * @namespace global
 * @class API_SCHEMA
 * @static
 * @readOnly
 */
var API_SCHEMA = {
	"GET: api/profil/": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Liste.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "spieler_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"AnmeldeDatum": { "$ref": "#/definitions/timestampPattern" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Punkte": {"type": "integer"},
					"GesetzteBloecke":{"type": "integer"}
				},
				"required": [
					"ProfilID", 
					"Name", 
					"AnmeldeDatum", 
					"LetzteAnmeldung",
					"Punkte",
					"GesetzteBloecke"
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/spieler_zeile" 
		}
	},
	
	"GET: api/profil/length": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Anzahl Spieler.",
		
		"type": "object",
		"properties": {
			"count": { "type": "integer" }
		},
		"required": [ 
			"count"
		]
	},

	"GET: api/profil/isonline/:profil_id": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Status.",
	    "type": "boolean"
	},
		
	"GET: api/profil/:von-:bis": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Eingegrenzte Spieler-Liste.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "spieler_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"AnmeldeDatum": { "$ref": "#/definitions/timestampPattern" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Punkte": {"type": "integer"},
					"GesetzteBloecke":{"type": "integer"}
				},
				"required": [
					"ProfilID", 
					"Name", 
					"AnmeldeDatum", 
					"LetzteAnmeldung",
					"Punkte",
					"GesetzteBloecke"
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/spieler_zeile" 
		}
	},
	
	"GET: api/profil/:profil_id": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Infos.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern
		},
	
		"type": "object",
		"properties": {
			"ProfilID": { "type": "integer" },
			"Name": { "type": "string" },
			"AnmeldeDatum": { "$ref": "#/definitions/timestampPattern" },
			"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
			"Punkte": {"type": "integer"},
			"GesetzteBloecke":{"type": "integer"}
		},
		"required": [
			"ProfilID", 
			"Name", 
			"AnmeldeDatum", 
			"LetzteAnmeldung",
			"Punkte",
			"GesetzteBloecke"
		]
	},
	
	"GET: api/profil/byname/:name": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Infos.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern
		},
	
		"type": "object",
		"properties": {
			"ProfilID": { "type": "integer" },
			"Name": { "type": "string" },
			"AnmeldeDatum": { "$ref": "#/definitions/timestampPattern" },
			"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" }
		},
		"required": [
			"ProfilID", 
			"Name", 
			"AnmeldeDatum", 
			"LetzteAnmeldung"
		]
	},
	
	"GET: api/profil/:profil_id/spiele": {	
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Infos.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "spiel_zeile": {
				"type": "object",
				"properties": {
					"SpielID": { "type": "integer" },
					"ProfilID": { "type": "integer" },
					"Dauer": { "type": "integer" },
					"MaxProfil": { "type": "integer" },
					"Datum": { "$ref": "#/definitions/timestampPattern"  },
					"SpielTypID": { "type": "integer" },
					"SpielTypBezeichnung": { "type": "string" },
					"SpielTypClass": { "type": "string" }
				},
				"required": [
					"SpielID",
					"ProfilID",
					"Dauer",
					"MaxProfil",
					"Datum",
					"SpielTypID",
					"SpielTypBezeichnung",
					"SpielTypClass",
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/spiel_zeile" 
		}
	},
	
	"GET: api/profil/:profil_id/spiele/:gametype": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieler-Infos.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "spiel_zeile": {
				"type": "object",
				"properties": {
					"SpielID": { "type": "integer" },
					"ProfilID": { "type": "integer" },
					"Dauer": { "type": "integer" },
					"MaxProfil": { "type": "integer" },
					"Datum": { "$ref": "#/definitions/timestampPattern"  },
					"SpielTypID": { "type": "integer" },
					"SpielTypBezeichnung": { "type": "string" },
					"SpielTypClass": { "type": "string" }
				},
				"required": [
					"SpielID",
					"ProfilID",
					"Dauer",
					"MaxProfil",
					"Datum",
					"SpielTypID",
					"SpielTypBezeichnung",
					"SpielTypClass",
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/spiel_zeile" 
		}
	},

	"GET: api/highscore/": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Highscore-Liste.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "highscore_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Spieleanzahl": { "type": "integer" },
					"Gesamtdauer": { "type": "integer" },
					"Punkte": { "type": "integer" },
					"GesetzteBloecke": { "type": "integer" },
					"Tastenanschlaege": { "type": "integer" },
					"Platz": {"type": "integer"}
				},
				"required": [
					"ProfilID",
					"Name",
					"LetzteAnmeldung",
					"Spieleanzahl",
					"Gesamtdauer",
					"Punkte",
					"GesetzteBloecke",
					"Tastenanschlaege",
					"Platz"
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/highscore_zeile" 
		}
	},
	
	"GET: api/highscore/types": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Spieltyp-Liste.",
		
		"definitions": {
			"spieltyp_zeile": {
				"type": "object",
				"properties": {
					"Bezeichnung": { "type": "string" }
				},
				"required": [
					"Bezeichnung"
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/spieltyp_zeile" 
		}
	},

	"GET: api/highscore/length": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Anzahl Highscore.",
		
		"type": "object",
		"properties": {
			"count": { "type": "integer" }
		},
		"required": [ 
			"count"
		]
	},

	"GET: api/highscore/length/:type": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Anzahl Highscore eines Spieltyps.",
		
		"type": "object",
		"properties": {
			"count": { "type": "integer" }
		},
		"required": [ 
			"count"
		]
	},

	"GET: api/highscore/:type": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Highscore-Liste eines Spieltyps.",
		
		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "highscore_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Spieleanzahl": { "type": "integer" },
					"Gesamtdauer": { "type": "integer" },
					"Punkte": { "type": "integer" },
					"GesetzteBloecke": { "type": "integer" },
					"Tastenanschlaege": { "type": "integer" },
					"Platz": {"type": "integer"}
				},
				"required": [
					"ProfilID",
					"Name",
					"LetzteAnmeldung",
					"Spieleanzahl",
					"Gesamtdauer",
					"Punkte",
					"GesetzteBloecke",
					"Tastenanschlaege",
					"Platz"
				]
			}
		},
		
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/highscore_zeile" 
		}
	},

	"GET: api/highscore/:type/:von": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Highscore-Info",

	    "type": "object",
		"properties": {
			"ProfilID": { "type": "integer" },
			"Name": { "type": "string" },
			"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
			"Spieleanzahl": { "type": "integer" },
			"Gesamtdauer": { "type": "integer" },
			"Punkte": { "type": "integer" },
			"GesetzteBloecke": { "type": "integer" },
			"Tastenanschlaege": { "type": "integer" },
			"Platz": {"type": "integer"}
		},
		"required": [
			"ProfilID",
			"Name",
			"LetzteAnmeldung",
			"Spieleanzahl",
			"Gesamtdauer",
			"Punkte",
			"GesetzteBloecke",
			"Tastenanschlaege",
			"Platz"
		]
	},
	
	"GET: api/highscore/:type/:von-:bis": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Eingegrenzte Highscore-Liste eines Spieltyps",

		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "highscore_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Spieleanzahl": { "type": "integer" },
					"Gesamtdauer": { "type": "integer" },
					"Punkte": { "type": "integer" },
					"GesetzteBloecke": { "type": "integer" },
					"Tastenanschlaege": { "type": "integer" },
					"Platz": {"type": "integer"}
				},
				"required": [
					"ProfilID",
					"Name",
					"LetzteAnmeldung",
					"Spieleanzahl",
					"Gesamtdauer",
					"Punkte",
					"GesetzteBloecke",
					"Tastenanschlaege",
					"Platz"
				]
			}
		},
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/highscore_zeile" 
		}
	},

	"GET: api/highscore/:von": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Highscore-Info",

	    "type": "object",
		"properties": {
			"ProfilID": { "type": "integer" },
			"Name": { "type": "string" },
			"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
			"Spieleanzahl": { "type": "integer" },
			"Gesamtdauer": { "type": "integer" },
			"Punkte": { "type": "integer" },
			"GesetzteBloecke": { "type": "integer" },
			"Tastenanschlaege": { "type": "integer" },
			"Platz": {"type": "integer"}
		},
		"required": [
			"ProfilID",
			"Name",
			"LetzteAnmeldung",
			"Spieleanzahl",
			"Gesamtdauer",
			"Punkte",
			"GesetzteBloecke",
			"Tastenanschlaege",
			"Platz"
		]
	},
	
	"GET: api/highscore/:von-:bis": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Eingegrenzte Highscore-Liste",

		"definitions": {
			"timestampPattern": pre_defs.timestampPattern,
		    "highscore_zeile": {
				"type": "object",
				"properties": {
					"ProfilID": { "type": "integer" },
					"Name": { "type": "string" },
					"LetzteAnmeldung": { "$ref": "#/definitions/timestampPattern" },
					"Spieleanzahl": { "type": "integer" },
					"Gesamtdauer": { "type": "integer" },
					"Punkte": { "type": "integer" },
					"GesetzteBloecke": { "type": "integer" },
					"Tastenanschlaege": { "type": "integer" },
					"Platz": {"type": "integer"}
				},
				"required": [
					"ProfilID",
					"Name",
					"LetzteAnmeldung",
					"Spieleanzahl",
					"Gesamtdauer",
					"Punkte",
					"GesetzteBloecke",
					"Tastenanschlaege",
					"Platz"
				]
			}
		},
	    "type": "array",
		"items": { 
			"$ref": "#/definitions/highscore_zeile" 
		}
	},

	"GET: api/statistic": {
	    "$schema": "http://json-schema.org/draft-04/schema#",
		"description": "Statistik",

	    "type": "object",
		"properties": {
			"online": { "type": "integer" },
			"spiele": { "type": "integer" },
			"uptime": { "type": "integer" }
		},
		"required": [
			"online",
			"spiele",
			"uptime"
		]
	}
};

if(typeof exports !== 'undefined'){
	exports.API_SCHEMA = API_SCHEMA;
} 
























