var util = require('./Util.js').Util;

var a1 = [[1,2,3],
		  [4,5,6],
		  [7,8,9]];
			  
var a2 = [[7,4,1],
		  [8,5,2],
		  [9,6,3]];
  
var a3 = [[9,8,7],
		  [6,5,4],
		  [3,2,1]];

var a4 = [[3,6,9],
		  [2,5,8],
		  [1,4,7]];

exports['secondsToReadable'] = function(test){
    test.equal(util.secondsToReadable(60), '1 Min. 0 Sek.');
    test.equal(util.secondsToReadable(80), '1 Min. 20 Sek.');
    test.notEqual(util.secondsToReadable(59), '0 Min. 59 Sek.');
    test.equal(util.secondsToReadable(59), '59 Sek.');
    test.equal(util.secondsToReadable(601), '10 Min. 1 Sek.');
    test.equal(util.secondsToReadable(132), '2 Min. 12 Sek.');
    test.equal(util.secondsToReadable(3661), '1 Std. 1 Min. 1 Sek.');
    test.equal(util.secondsToReadable('Hallo'), 'Hallo');
    test.done();	
};

exports['util.dreheArray'] = function(test){
	test.deepEqual(util.dreheArray(a2),a1);
	test.deepEqual(util.dreheArray(util.dreheArray(a3)),a1);
	test.deepEqual(util.dreheArray(util.dreheArray(util.dreheArray(a4))),a1);
	test.deepEqual(util.dreheArray(util.dreheArray(util.dreheArray(util.dreheArray(a1)))),a1);
	test.notDeepEqual(util.dreheArray(a1), a2);
	test.done();
};

exports['util.dreheRechtsArray'] = function(test){
	test.deepEqual(util.dreheRechtsArray(a1),a2);
	test.deepEqual(util.dreheRechtsArray(util.dreheRechtsArray(a1)),a3);
	test.deepEqual(util.dreheRechtsArray(util.dreheRechtsArray(util.dreheRechtsArray(a1))),a4);
	test.deepEqual(util.dreheRechtsArray(util.dreheRechtsArray(util.dreheRechtsArray(util.dreheRechtsArray(a1)))),a1);
	test.notDeepEqual(util.dreheRechtsArray(a2), a1);
	test.done();
};


exports['inArray'] = function (test) {
    test.equal(util.inArray([1,2,3,4,5,6,7], 6), true);
    test.equal(util.inArray([1,2,3,4,5,6,7], 8), false);
    test.done();
};

exports['posArray'] = function(test){
	test.equal(util.posArray([1,2,3,4,5,6,7], 1), 0);
	test.equal(util.posArray([1,2,3,4,5,6,7], 4), 3);
	test.equal(util.posArray([1,2,3,4,5,6,7], 7), 6);
    test.equal(util.posArray([1,2,3,4,5,6,7], 8), -1);
	test.equal(util.posArray([1,2,3,4,5,6,7], 9), -1);
	test.equal(util.posArray([1,2,3,4,5,6,7], 3), 2);
    test.done();
};

exports['delArray'] = function(test){	
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 1), [2,3,4,5,6,7]);
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 2), [1,3,4,5,6,7]);
	test.deepEqual(util.delArray([7,6,5,4,3,2,1], 3), [7,6,5,4,2,1]);
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 4), [1,2,3,5,6,7]);
	test.deepEqual(util.delArray([3,2,4,7,1,6,5], 5), [3,2,4,7,1,6]);
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 6), [1,2,3,4,5,7]);
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 7), [1,2,3,4,5,6]);
	test.deepEqual(util.delArray([1,2,3,4,5,6,7], 8), [1,2,3,4,5,6,7]);
	test.deepEqual(util.delArray([7,6,5,4,3,2,1], 9), [7,6,5,4,3,2,1]);
	test.done();					
};

exports['arraySchuffle'] = function(test){
	test.equal(util.arraySchuffle([1,2,3,4,5,6,7]).length, 7);
	test.equal(util.arraySchuffle([]).length, 0);
	test.equal(util.arraySchuffle([1,2,3]).length, 3);
	test.notDeepEqual(util.arraySchuffle([1,2,3,4,5,6,7]), [1,2,3,4,5,6,7]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.notDeepEqual(util.arraySchuffle([1,3,5,7,9]), [1,3,5,7,9]);
	test.done();					
};

exports['formatTimestamp'] = function(test){
	test.equal(util.formatTimestamp("2014-04-17T12:05:00.000Z"), "17. April 2014");
	test.equal(util.formatTimestamp("2014-08-08T12:05:00.000Z"), "8. August 2014");
	test.equal(util.formatTimestamp("1742-07-17T12:05:00.000Z"), "17. Juli 1742");
	test.equal(util.formatTimestamp("1992-06-06T12:05:00.000Z"), "6. Juni 1992");
	test.equal(util.formatTimestamp("1989-06-25T12:05:00.000Z"), "25. Juni 1989");
	test.equal(util.formatTimestamp("1988-09-23T12:05:00.000Z"), "23. September 1988");
	test.done();
};
