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
				text += "<div class='news' style='background: white;box-shadow: #807f7f2e 0 0 1px 0px;'>";
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
});