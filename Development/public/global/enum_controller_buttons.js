'use strict';

/**
 * Weist den Buttons vom Controller Zahlen zu
 *
 * @module global
 * @namespace global
 * @class BUTTON
 * @static
 * @readOnly
 */
var BUTTON = {
	Left: 0,
	Right: 1,
	Down: 2,
	RotateLeft: 3,
	RotateRight: 4,
	Item1: 5,
	Item2: 6,
	Item3: 7,
	Exit: 8,
	Login: 9,
	Register: 10
};

/**
 * Weist den Eigenschaften von Button, ob er gedrückt ist oder nicht, Zahlen zu
 *
 * @namespace global
 * @class BUTTONTYPE
 * @static
 * @readOnly
 */
var BUTTONTYPE = {
	Up: 0,
	Down: 1
};

if(typeof exports !== 'undefined'){
	exports.BUTTONTYPE = BUTTONTYPE;
	exports.BUTTON = BUTTON;
} 