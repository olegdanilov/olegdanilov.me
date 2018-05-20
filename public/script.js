$(".content").hide(); // Hide content wile page not loaded
$(document).ready(function() {

	$(document).ajaxError(function() {
		Materialize.toast("<text class='unknown_error'>Something went wrong. Try again later</text>", 10000);
	});

	function timeConverter(UNIX_timestamp){
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	// Lоad news
	$.ajax({
		url: "https://olegdanilov.me/news",
		success: function(data) {
			var data = data.data;
			for (var i = 0; i < data.length; i++) {
				var text = "";
				text += "<div class='news'>";
				text += "<div class='title read waves-effect' id='" + data[i].id + "'>";
				text += data[i].title;
				text += "</div>";
				text += "<div class='text'>";
				text += data[i].text.replace(/<\/?[^>]+>/g,'');
				text += "</div>";
				text += "<div class='bottom_info'>";
				text += "<div class='time'>";
				text += timeConverter(data[i].time);
				text += "</div></div>";
				text += "</div>";
				$("#news").append(text);
			}
			$(".read").click(function() {
				window.location.replace("https://olegdanilov.me/news/" + $(this).attr("id"));
			});
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$("head").append('<link rel="stylesheet" href="public/m.css">');
				$(".last_news").css("padding-left", "0%");
				$(".last_news").css("padding-right", "0%");
			} 
			// Preloader
			$("#preloader-main").hide();
			$(".content").fadeIn("slow");
			// Show content
		}
	})

	//translate();

	$("iframe").css("max-width", "100%");

});

function get_lang() {
	return navigator && (
		navigator.language ||
		navigator.userLanguage ||
		null );	
}

function translate() {
	if (get_lang() == "uk-UA" || get_lang() == "uk" || get_lang() == "uk-ua") {
		$.ajax({
			url: "https://olegdanilov.me/public/lang_packs/ua.json",
			success: function(data) {
				$("text").each(function() {
					$(this).html(data[$(this).attr("class")]);
				});
			}
		});
	}
	if ((user.get_lang() == "ru-RU" || user.get_lang() == "ru" || user.get_lang() == "ru-ru") && (navigator.languages[1] !== "en-GB" && navigator.languages[1] !== "en-US")) {
		$.ajax({
			url: "https://olegdanilov.me/public/lang_packs/ru.json",
			success: function(data) {
				$("text").each(function() {
					$(this).html(data[$(this).attr("class")]);
				});
			}
		});
	}
}