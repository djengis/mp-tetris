'use strict';

var DEBUG = false;

/**
 * Dient zur Konfiguration des ganzen Systems.
 *
 * @module global
 * @namespace global
 * @class CONFIG
 * @static
 * @readOnly
 */
var CONFIG = {
	
	/**
	 * @attribute CONFIG.DEBUG
	 * @readOnly
	 * @type Boolean
	 */
	"DEBUG": DEBUG,

	/**
	 * Bindings der Buttons auf der Tastatur zu den Buttons auf dem Controller.
	 *
	 * @attribute CONFIG.KEYS
	 * @readOnly
	 * @type Map
	 */
	KEYS: {
		Left: 65,
		Right: 68,
		Down: 83,
		RotateLeft: 81,
		RotateRight: 69,
		Item1: 49,
		Item2: 50,
		Item3: 51,
		Exit: 27,
		Login: null,
		Register: null
	},
	
	/**
	 * Gibt an, wie lange gewartet wird, bevor die Seite nach einem reconnect neu geladen wird (in Millisekunden). 
	 *
	 * @attribute CONFIG.reconnectReloadTime
	 * @readOnly
	 * @default 1500
	 * @type Number
	 */
	reconnectReloadTime: 1000,
	
	/**
	 * Die maximale mögliche Anzahl an Spielern pro Spiel.
	 *
	 * @attribute CONFIG.maxSpieler
	 * @readOnly
	 * @default 4
	 * @type Number
	 */
	maxSpieler: 4,
	
	/**
	 * Port, auf dem der Server läuft.
	 *
	 * @attribute CONFIG.port
	 * @readOnly
	 * @default 1337
	 * @type Number
	 */
	port: 1337,
	
	/**
	 * Die Zeit (ms), die gewartet wird, nachdem bei einem Spiel auf Start geklickt wurde.
	 *
	 * @attribute CONFIG.gameStartWaitTimer
	 * @readOnly
	 * @default 3000
	 * @type Number
	 */
	gameStartWaitTimer: 3000,
	
	/**
	 * Die Nachricht, die der Controller erhält, sobald dieser sich von einem Profil trennt.
	 *
	 * @attribute CONFIG.byebye_message
	 * @readOnly
	 * @default ""
	 * @type String
	 */
	byebye_message: "Bye. Werd' dich vermissen. :,/",
	
	
	/**
	 * Konfiguration des Routers.
	 *
	 * @attribute CONFIG.router
	 * @readOnly
	 * @type Map
	 */
	router: {

		/*
		 * Dateien, die nicht abgegriffen werden dürfen.
		 *
		 * @attribute CONFIG.router.doNotRoute
		 * @readOnly
		 * @type Map
		 */
		doNotRoute: [
			"/global/db.js"
		],
			
		/**
		 * Map mit welcher definiert wird, welcher MIME-Type bei welchem Dateityp gesendet wird.
		 * Links steht die Dateiendung, rechts der MIME-Type.
		 *
		 * @attribute CONFIG.router.mimes
		 * @readOnly
		 * @type Map
		 */
		mimes: {
			"js":   "text/javascript",
			"txt":  "text/plain",
			"xml":  "text/xml",
			"css":  "text/css",
			"png":  "image/png",
			"jpg":  "image/jpg",
			"svg":  "image/svg+xml",
			"jpeg": "image/jpeg",
			"gif":  "image/gif",
			"ogg":  "audio/ogg",
			"mp3":  "audio/mpeg",
			"wav":  "audio/wav",
			"mp4":  "audio/mp4",
			"oga":  "audio/ogg",
			"manifest": "text/cache-manifest",
			"jhtml":"text/html",
			"json": "application/json"
		},
		
		/**
		 * Sollen Daten im Cache gespeichert werden?
		 *
		 * @attribute CONFIG.router.cache
		 * @readOnly
		 * @type Map
		 */
		cache: !DEBUG,
		
		/**
		 * Sollen Daten komprimiert werden?
		 *
		 * @attribute Config.router.zip
		 * @readOnly
		 * @type Map
		 */
		zip: !DEBUG,
		
		/**
		 * Soll der Router beim Routing Optimierung durchführen?
		 *
		 * @attribute Config.router.minify
		 * @readOnly
		 * @type Map
		 */
		minify: !DEBUG
	},
	
	/**
	 * Konfigurationsdaten für die jeweiligen Spiele.
	 *
	 * @attribute CONFIG.Games
	 * @readOnly
	 * @type Map
	 */
	Games: {
		SpielAufZeit: {
			W: 15,
			H: 18,
			buttonDownIntervalTime: 50,
			buttonDownWaitIntervals: 3,
			levelTicks: [60,50,40,35,30,25,20,15,10,9,8,7,6,5,4,3,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			linesForLevel: 6
		}
	},
	
	/**
	 * Konfigurationsdaten für die Highscore-Liste.
	 *
	 * @attribute CONFIG.Highscore
	 * @readOnly
	 * @type Map
	 */
	Highscore: {
		pages: 2,
		maxEntry: 15,
		interval: 60
	},
	
	/**
	 * Konfigurationsdaten für die Profil-Liste.
	 *
	 * @attribute CONFIG.ProfilListe
	 * @readOnly
	 * @type Map
	 */
	ProfilListe: {
		pages: 2,
		maxEntry: 15,
		interval: 60
	}
};

if(typeof exports !== 'undefined'){
	exports.CONFIG = CONFIG;
} 
