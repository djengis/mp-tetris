'use strict';

$(window).ready(function(){

	$("#wrap").css({opacity: 0}).animate({
			opacity: 0
	}, 750, "linear", function(){
		$("#wrap").animate({
			opacity: 1
		}, 550, "easeOutQuad");
	});

	// a-tag-effekt
	$("a").on("click", function(){
		
		$("#wrap").animate({
			opacity: 0
		}, 250, "easeOutQuad", function(){
			window.location = $(this).attr("href");
		}.bind(this));
		
		
		return false;
	});

	//

	loadStatistics();
	setInterval(loadStatistics, 5000);

	var element = $("<div id='logo_effekt'></div>");
	$("#logo").after(element);
	$("#logo_effekt").css({
		"position": "absolute",
		"top": "50%",
		"left": "50%",
		"margin-left": "-140px",
		"margin-top": "-247px",
		"height": "0px",
		"z-index": 50,
		"width": "279px",
		backgroundColor: "#6f7e8d"
	});
	
	
	function up(){
		$("#logo").css({
			opacity: 1
		});
		
		$("#logo_effekt").stop().animate({
			"margin-top": "-141px", 
			"height": "0px",
		}, 3500, "easeOutQuad");
		
		
		$("#logo_effekt").css({
			backgroundColor: "#8ea4b9"
		});
		
		$("#logo_effekt").animate({
			backgroundColor: "#6f7e8d"
		}, 200, "easeOutQuad");
	}
	
	function down(){
		$("#logo_effekt").css({
			"margin-top": "-247px",
			backgroundColor: "#6f7e8d"
		});
		
		$("#logo").css({
			opacity: 0
		});
				
		$("#logo_effekt").stop().animate({
			"margin-top": "-247px",
			"height": "107px",
			backgroundColor: "#6f7e8d"
		}, 250, "easeInQuad", up);
	}
	
	setTimeout(down, 1000);
});

function loadStatistics(){
	$.getJSON("/api/statistics", function(data){
	
		$("#spieler_online").prop('number', parseInt($("#spieler_online").html()));
		$("#spieler_online").animateNumber({ number: data.online }, 500, 'easeOutQuad');	
		
		$("#spiele").prop('number', parseInt($("#spiele").html()));
		$("#spiele").animateNumber({ number: data.spiele }, 500, 'easeOutQuad');	
		
		$("#uptime").prop('number', parseInt($("#uptime").html()));
		$("#uptime").animateNumber({ number: data.uptime }, 5000, 'easeOutQuad');		
		
	});
}