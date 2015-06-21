'use strict';

/**
 * Klasse zum abspielen von Soundeffekten.
 *
 * lib: https://github.com/goldfire/howler.js
 *
 * @module display
 * @namespace display
 *
 * @class MyAudio
 * @constructor
 */
function MyAudio(){
	/**
	 * HashMap mit allen mit load geladenen Sound als Howl-Instance.
	 *
	 * @property _cache
	 * @type Object
	 * @default {}
	 * @private
	 */
	this._cache = {};
	
	/**
	 * Globaler Wert der Lautstärke als Float zwischen 0.0 und 1.0.
	 *
	 * @property _volume
	 * @type Number
	 * @default 1.0
	 * @private
	 */
	 this._volume = 1.0;
	
	/**
	 * Gibt an, ob die Sounds abgespielt werden sollen oder nicht.
	 *
	 * @property _active
	 * @type boolean
	 * @default true
	 * @private
	 */
	 this._active = true;
}

/**
 * Entfernt alles, was geladen und gesetzt wurde. Setzte alles wieder auf Default-Werte.
 *
 * @method reset
 */
MyAudio.prototype.reset = function(){
	this._cache = {};
	this._volume = 1.0;
};

/**
 * Definiert eine entsprechende Sound-File.
 *
 * @method load
 *
 * @param {String} name der Key
 * @param {String} filePath Pfad zur Audio-Datei
 */
MyAudio.prototype.load = function(name, filePath){
	var sound = new Howl({
	  urls: [filePath]
	});
	this._cache[name] = sound;
};

/**
 * Spielt ein Sound anhand seinem zuvor definierten Namen ab.
 *
 * @method play
 *
 * @param {String} name der Key
 */
MyAudio.prototype.play = function(name){
	if(!this._active) return;
	this._cache[name].volume = this._volume;
	this._cache[name].play();
};