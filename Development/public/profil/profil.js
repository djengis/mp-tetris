"use strict";

var actPage = 0;
var maxEntry = CONFIG.ProfilListe.maxEntry;
var pages = CONFIG.ProfilListe.pages;

function getAllProfile(act){
	var von = (act*maxEntry)+1;
	var bis = (maxEntry-1) + von;
	console.log("von ", von);
	console.log("bis ", bis);
	$.getJSON('/api/profil/' + von + '-' + bis, function(data){ //+ von + '/' + bis <th> gesetze Steine </th
		actPage = act;
		var head = "<tr><th>ID</th><th>Name</th><th>Punkte</th>><th style='width:120px;'> </th><th style='width:140px;'> </th></tr>";
		$('#ProfilTable').html(head);
		var i;
		var tr = ''
		for(i = 0; i < data.length; i++){
			tr += '<tr>';
			tr += replaceString('<td>?</td>', data[i].ProfilID);
			tr += replaceString('<td>?</td>', data[i].Name);
			tr += replaceString('<td>?</td>', data[i].Punkte);
			//tr += replaceString('<td>?</td>', data[i].GesetzteBloecke);
			tr += replaceArray('<td><a href="?">??</a></td>', [data[i].ProfilID, 'Details anzeigen']);
			tr += replaceArray('<td><a href="/display/#profil/?">??</a></td>',[data[i].ProfilID, 'als Display folgen']);
			tr += '</tr>';
		}
		$('#ProfilTable').append(tr);
		getPager();
	});
}


/**
 * Erstellt den Pager.
 *
 * @method getPager
 */
function getPager(){
	$.getJSON('/api/profil/length/', function(data){
		var pagination = Math.ceil(data.count/maxEntry) -1;
		var i, j, range, text = '';
		var link = '<li ??><a href="javascript:;" onclick="getAllProfile(?)">???</a></li>';
		if(1 <= pagination){
			i = 1;
			if (actPage != 0){
				i = actPage - pages +1;
				if (i < 1)
					i = 1;
				text += replaceArray(link, [0, '', 'erste Seite']);
				text += replaceArray(link, [actPage-1, '', 'vorherige Seite']);
				if (1 < i)
					text += '<li><p>...</p></li>';	 
			}
			while(i < actPage+1){
				text += replaceArray(link, [i-1, '', i]);
				i += 1;
			}
			text += replaceArray(link, [actPage, 'class="on"', actPage+1]);
			while(i < (actPage + pages +1) && i <= pagination){
				i += 1;
				text += replaceArray(link, [i-1, '', i]);
			}
			if (i <= pagination)
				text += '<li><p>...</p></li>';
			if (actPage < pagination){
				text += replaceArray(link, [actPage+1, '', 'n&auml;chste Seite']);
				text += replaceArray(link, [pagination, '', 'letzte Seite']);
			}
		}
		$('#pager').html(text);
	});
}

function replaceString(link, value){
	return link.replace('?', value);
}


/**
 * Ersetzt die Vorkommen von '?' in link den Werten in array
 *
 * @method replaceArray
 * @param  {String}	  beinhaltet mehrere '?', die ersetzt werden sollen
 * @param  {Array}	  die String in value werden für '?' eingefügt
 */
function replaceArray(link, array){
	if (array.length == 3)
		return link.replace('???', array[2]).replace('??', array[1]).replace('?', array[0]);
	else if (array.length == 2)
		return link.replace('??', array[1]).replace('?', array[0]);

}

function getOneProfil(id){
	$.getJSON('/api/profil/'+id, function(data){
			var tr = '<tr>'
			tr += '<td>' + data.ProfilID + '</td>';
			tr += '<td>' + data.Name + ' </td>';
			tr += '<td>' + Util.formatTimestamp(data.AnmeldeDatum) + '</td>';
			tr += '<td>' + Util.formatTimestamp(data.LetzteAnmeldung, true, "nie") + '</td>';
			tr += '<td>' + data.Punkte + ' </td>';
			$('#DetailProfilTable').append(tr);
			
			$("#profilName").text(data.Name);
	});
	
	$.getJSON('/api/profil/'+id+"/spiele", function(data){
		var i;
		for(i = 0; i < data.length; i++){
			var tr = '<tr>'
			//tr += '<td>' + data[i].SpielID + '</td>';
			//tr += '<td>' + data[i].punkte + ' </td>';
			tr += '<td>' + data[i].SpielTypBezeichnung + '</td>';
			tr += '<td>' + Util.formatTimestamp(data[i].Datum, true) + '</td>';
			tr += '<td>' + Util.secondsToReadable(data[i].Dauer) + ' </td>';
			tr += '<td> <a href="/display#spiel/' + data[i].SpielID + '">Spieldetails Anzeigen »</a></td>';
			
			http://localhost:1337735
			$('#SpielTabelle').append(tr);
		}
	});
}

$(window).ready(function(){
	var id = parseInt(window.location.pathname.replace(/\/$/g,"").split( '/' ).pop());
	if(id){
		getOneProfil(id);
	}else{
		getAllProfile(actPage);
		window.setInterval("getAllProfile(actPage)", (CONFIG.ProfilListe.interval * 1000));
	}
});
