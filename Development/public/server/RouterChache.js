"use strict";

var CONFIG = require('./../global/config.js').CONFIG;
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var fs = require('fs');
var zlib = require('zlib');


/**
 * @module server
 * @namespace server
 *
 * @class RouterChache
 * @constructor
 */
function RouterChache(){
	
	/**
	 * Sollen die eingehenden Daten minimiert werden?
	 *
	 * @property _minifyData
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._minifyData = CONFIG.router.minify;
	
	/**
	 *
	 * @property _minifyFunctions
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._minifyFunctions = this._getMinifyFunctions();
	
	/**
	 * Sollen die eingehenden Dateien gezipt werden?
	 *
	 * @property _zip
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._zip = CONFIG.router.zip;
	
	/**
	 * Map von Dateien im Cache
	 *
	 * @property _fileCache
	 * @type Map
	 * @default {}
	 * @private
	 */
	this._fileCache = {};
	
	/**
	 * Funktionen zur Optimierung von dateien
	 *
	 * @property _replacers
	 * @type Array
	 * @default {}
	 * @private
	 */
	this._replacers = [];
}

/**
 * Fügt der Liste _replacers eine neue Funktion hinzu
 *
 * @method addReplacer
 * @param {Function} replacer
 */
RouterChache.prototype.addReplacer = function(replacer){
	this._replacers.push(replacer);
};

/**
 * Setzt zip und minifyData
 *
 * @method setParams
 * @param {Boolean} zip
 * @param {Boolean} minify
 */ 
RouterChache.prototype.setParams = function(zip, minify){
	this._zip = zip;
	this._minifyData = minify;
};

/**
 *
 *
 * @method loadFile
 * @param {String} dataPath
 * @param {Function} callback
 */ 
RouterChache.prototype.loadFile = function(dataPath, callback){
	var chacheKey = this._getChacheKey(dataPath);

	// prüfe, ob es die Datei überhaupt gibt
	var exist = fs.existsSync(dataPath);
	if(!exist){
		// datei gibts nicht ODER konnte nicht gelesen werden..
		callback(null);
		return;
	}
	
	// die datei gibts. hol dir die dateiinformationen
	var stats = fs.statSync(dataPath);
	
	
	// ist es schon im chache?
	if(CONFIG.router.cache && this.inCache(dataPath)){
		var changed = (stats.mtime.toString() != this.getMtime(dataPath).toString());
		
		if(!changed){
			callback(this._fileCache[chacheKey]);
			return;
		}
	}

	var data, ext, mime, headers = [];
	
	try{
		data  = fs.readFileSync(dataPath);
	}catch(e){
		callback(null);
		return;
	}
	
	ext = dataPath.split(".");
	ext = ext[ext.length-1].toLowerCase();
	mime = null;
	if(ext in CONFIG.router.mimes){
		mime = CONFIG.router.mimes[ext];
		headers.push(["Content-Type", mime]);
	}else{
		// Content-Type nicht gefunden
	}
	
	if(this._minifyData){
		if(ext in this._minifyFunctions){
			data = this._minifyFunctions[ext](data);
		}
	}
	
	data = this._doReplaces(data, ext);
		
	if(this._zip) {
		headers.push(["Content-Encoding", "gzip"]);
		
		zlib.gzip(data, function (error, result) {
			if (error){ 
				console.log(error)
				throw error; 
			}
			
			var ret = {
				"data": result,
				"mime": mime,
				"headers": headers,
				"stats": stats
			};
			
			if(CONFIG.router.cache){
				this._fileCache[chacheKey] = ret;
			}
			
			callback(ret);
		}.bind(this));
		return;
	} else {
	
		var ret = {
			"data": data,
			"mime": mime,
			"headers": headers,
			"stats": stats
		};
		
		if(CONFIG.router.cache){
			this._fileCache[chacheKey] = ret
		}
		
		callback(ret);
		return;
	}	
};

/**
 * Führt sämtliche Funktionen in _replacers an data aus
 *
 * @method _doReplaces
 * @param {JSON} data
 * @param {String} ext
 * @private 
 */
RouterChache.prototype._doReplaces = function(data, ext){
	for(var i in this._replacers){
		data = this._replacers[i](data, ext);
	}
	return data;
};

/**
 * @method getData
 * @param {String} pfad
 * @return {JSON}
 */ 
RouterChache.prototype.getData = function(pfad){
	var key = this._getChacheKey(pfad);
	if(!(key in this._fileCache)) return null;
	var chacheKey = this._getChacheKey(pfad, this._zip, this._minifyData);
	return this._fileCache[chacheKey].data;
};

/**
 *
 *
 * @method getMtime
 * @param {String} pfad
 */ 
RouterChache.prototype.getMtime = function(pfad){
	var key = this._getChacheKey(pfad);
	if(!(key in this._fileCache)) return null;
	var chacheKey = this._getChacheKey(pfad, this._zip, this._minifyData);
	return this._fileCache[chacheKey].stats.mtime;
};

/**
 *
 *
 * @method getMime
 * @param {String} pfad
 */ 
RouterChache.prototype.getMime = function(pfad){
	var key = this._getChacheKey(pfad);
	if(!(key in this._fileCache)) return null;
	var chacheKey = this._getChacheKey(pfad, this._zip, this._minifyData);
	return this._fileCache[chacheKey].mime;
};

/**
 *
 *
 * @method inCache
 * @param {String} pfad
 * @return {Boolean}
 */
RouterChache.prototype.inCache = function(pfad){
	var key = this._getChacheKey(pfad);
	
	return (key in this._fileCache);
};

/**
 * Gibt die Minifiy-Funtion nach ext (Dateiendung) zurück.
 * Falls diese nicht vorhanden ist, wird null zurückgegeben.
 *
 * @method _getMinifyfunctionByExt
 * @private
 * @param {String} ext
 * @return {Function|null} 
 */
RouterChache.prototype._getMinifyFunctionByExt = function(ext){
	if(this._minifyFunctions === null || this._minifyFunctions === undefined){
		this._minifyFunctions = this._getMinifyFunctions();
	}
	
	if(ext in this._minifyFunctions){
		return this._minifyFunctions[ext];
	}
	
	return null;
};

/**
 * @method _getChacheKey
 * @private
 * @return {String}
 */
RouterChache.prototype._getChacheKey = function(pfad){
	return this._minifyData+"#"+this._zip+"#"+pfad;
};

/**
 * *Magic*
 *
 * @method _getMinifyFunctions
 * @private
 */
RouterChache.prototype._getMinifyFunctions = function(){
	
	var f = {};
	
	f["js"] = function(data){
		// BUG: entfernt einzeilige kommentare nicht richtig!
		
		var orig_code = data.toString();
		var ast = jsp.parse(orig_code);
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		var final_code = pro.gen_code(ast);
		return final_code+"";
	};
	
	f["html"] = f["jhtml"] = function(data){
		data = data.toString();
		data = data.replace(/\r|\n|\t/g, " ");
		data = data.replace(/\s+/g, ' '); //entferne multiple leerzeichen
		return data;
	};
	
	f["css"] = function(data){
		data = data.toString();
		data = data.replace(/\r|\n|\t/g, " ");
		
		// danke an http://www.highdots.com/forums/javascript-german/kommentare-entfernen-51200.html für den "QuickHack"
		var rx = /\/\*([^*]|\*[^\/])*\*\/|\/\/[^\r\n]*(\r|\r?\n)/mg; // entferne /**/ kommentare
		data = data.replace(rx, "$2");
		data = data.replace(/\s+/g, ' ');
		
		data = data.replace(/: | :/g, ":");
		data = data.replace(/> | >/g, ">");
		data = data.replace(/< | </g, "<");
		data = data.replace(/\{ | \{/g, "{");
		data = data.replace(/\} | \}/g, "}");
		data = data.replace(/; | ;/g, ";");
		
		
		return data;
	};

	return f;
};

exports.RouterChache = RouterChache;
