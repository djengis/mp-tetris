'use strict';

/**
 * Konsturktor für Util
 *
 * @module global
 * @namespace global
 * @class Util
 * @constructor
 */
function Util(){
	/* void	*/
}

/**
 * Berechnet den Logarithms zur Basis 10.
 *
 * @method log10
 * @static
 * @param {Number} n 
 */
Util.log10 = function(n) {
  return Math.log(n) / Math.LN10;
};

/**
 * @method setIfChanged
 * @static
 * @param {jQuery-DOM-Element} element 
 * @param {String} newString
 * @param {Boolean} isHtml
 */
Util.setIfChanged = function(element, newString, isHtml){
	var oldString;
	newString = ""+newString; // sorge dafür, dass es auf jedenfall ein String ist.
	
	if(isHtml){
		oldString = element.html();
	}else{
		oldString = element.text();
	}
	
	if(oldString !== newString){
		if(jQuery.isNumeric(oldString) && jQuery.isNumeric(newString)){
			// number ändern
			
			var nOld = parseInt(oldString);
			var nNew = parseInt(newString);
			
			element.prop('number', nOld)
			element.animateNumber({ number: nNew, easing: 'easeInQuad' });
			
		}else{
			// String ändern
			element.css("opacity", 0).animate({opacity: 1}, 500);	
			
			if(isHtml){
				element.html(newString);
			}else{
				element.text(newString);
			}
		}			
	}
};

/**
 * Gibt einen leserlichen String zurück.
 *
 * @method secondsToReadable
 * @static
 * @param {Number} Sekunden
 * @return {String}
 */
Util.secondsToReadable = function(sec){
	if(sec<60){
		return sec+" Sek.";
	}else if(sec<60*60){
		var minuten = Math.floor(sec/60);
		var sekunden = sec%60;
		return minuten+" Min. "+sekunden+" Sek.";
	}else if(sec<60*60*60){
		var stunden = Math.floor(sec/(60*60));
		var minuten = Math.floor((sec%(60*60)/60));
		var sekunden = sec%60;
		return stunden+" Std. "+minuten+" Min. "+sekunden+" Sek.";
	}else{
		return sec;
	}
};

/**
 * Funktion fuer Random-Werte zum Fuellen der SpielDaten
 *
 * @method rand
 * @static
 * @param {Number}	Minimum
 * @param {Number}	Maximum
 */
Util.randInteger = function(minwert, maxwert){
	if(maxwert===undefined){
		maxwert = minwert;
		minwert = 0;
	}
	return Math.floor((Math.random() * (maxwert - minwert)) + minwert);
}

/**
 * Funktion fuer das Drehen eines Arrays gegen den Uhrzeigersinn
 *
 * @method dreheArray
 * @static
 * @param {Array} 	Array, das gedreht werden soll
 * @return {Array}	gedrehte Array
 */
Util.dreheArray = function(array) {
	var i,j;
	var neuesArray = new Array(array[0].length);//new int[array[0].length][array.length];
	
	for (i=0; i<neuesArray.length; i++) {
		neuesArray[i] = new Array(array.length);
		for (j=0; j<neuesArray[0].length; j++) {
			neuesArray[i][j] = array[j][array[j].length-i-1];
		}
	}
	
	return neuesArray;
}

/**
 * Funktion fuer das Drehen eines Arrays im Uhrzeigersinn
 *
 * @method dreheArray
 * @static
 * @param {Array} 	Array, das gedreht werden soll
 * @return {Array}	gedrehte Array
 */
Util.dreheRechtsArray = function(array) {
	var i,j; 
	var neuesArray = new Array(array[0].length);//new int[array[0].length][array.length];
	var y = neuesArray.length;

	for (i=0; i<neuesArray.length; i++) 
		neuesArray[i] = new Array(array.length);
	
	for (i=0; i<neuesArray.length; i++) {
		y -= 1;
		for (j=0; j<neuesArray[0].length; j++) 
			neuesArray[y][array[j].length-j-1] = array[j][array[j].length-i-1];
	}
	return neuesArray;
}


/**
 * Überprüft, ob sich das gesuchte Objekt in dem Array befindet
 *
 * @method inArray
 * @static
 * @param {Array} 	haystack
 * @param {Object} 	needle
 * @return {Boolean}
 */
Util.inArray = function(haystack, needle){
	var i;
	for(i in haystack){
		if(haystack[i] === needle){
			return true;
		}
	}
	return false;
};

/**
 * Gibt den Index des gesuchten Elements wieder, sonst -1.
 *
 * @method posArray
 * @static
 * @param {Array} 	haystack
 * @param {Object} 	needle
 * @return {Number}
 */
Util.posArray = function(haystack, needle){
	var i;
	for(i in haystack){
		if(haystack[i] === needle){
			return i;
		}
	}
	return -1;
};

/**
 * Entfernt needle von haystack.
 *
 * @method delArray
 * @static
 * @param {Array} 	haystack
 * @param {Object} 	needle
 * @return {Array}	haystack ohne needle
 */
Util.delArray = function(haystack, needle){
	var i;
	var newhaystack = [];
	for(i in haystack){
		if(haystack[i] !== needle){
			newhaystack.push(haystack[i]);
		}
	}	
	return newhaystack;
};


/**
 * Ordnet die Elemente im Array zufällig an (nach Fisher-Yates algorithm)
 *
 * @method arraySchuffle
 * @static
 * @param {Array} array
 * @return {Array}
 */
Util.arraySchuffle = function(array){
	var ret = [];
	
	for(var j in array){
		ret.push(array[j]);
	}

    var i = ret.length, j, temp;
    if(i == 0) return;
    while(--i) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = ret[i];
        ret[i] = ret[j];
        ret[j] = temp;
    }
	return ret;
};

/**
 * Konvertiert Timestamp in das Format dd. MM yy
 *
 * @method formatTimestamp
 * @static
 * @param {String} timestmap
 * @param {Boolean} time
 * @param {String} invalidDatumText
 * @return {String} r	formatiertes Datum
 * @example
 		Util.formatTimestamp("2014-04-17T12:05:00.000Z")
 		return 17. April 2014
 */
Util.formatTimestamp = function(timestmap, time, invalidDatumText){
	var Monat = ["Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	
	var d = new Date(timestmap);
	
	if(d=="Invalid Date"){
		if(invalidDatumText){
			return invalidDatumText;
		}else{
			return null;
		}
	}
	
	var r = d.getDate() + ". " + Monat[d.getMonth()] + " " + d.getFullYear();
	
	if(time){
		var Std = d.getHours();
		var Min = d.getMinutes();
		var StdAusgabe = ((Std < 10) ? "0" + Std : Std);
		var MinAusgabe = ((Min < 10) ? "0" + Min : Min);
		r += " um "+StdAusgabe+":"+MinAusgabe+" Uhr";
	}
	
	return r;
};

if(typeof exports !== 'undefined'){
	exports.Util = Util;
} 
