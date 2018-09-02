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
		url: "https://olegdanilov.me/get_news",
		success: function(data) {
			var data = data.data;
			for (var i = 0; i < data.length; i++) {
				var text = "";
				text += "<div class='news' style='background: white;box-shadow: #807f7f 0 0 1px 0px;'>";
				text += "<div class='article_img'>";
				text += "<img src='" + data[i].img + "' alt='" + data[i].title + "' class='responsive-img read' id='" + data[i].id + "'>";
				text += "</div>"
				text += "<div class='title read' id='" + data[i].id + "'>";
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
			get_last_comments();
			// Preloader
			$("#preloader-main").hide();
			$(".content").fadeIn("slow");
			$("nav").fadeIn("slow");
			// Show content
		}
	});

	function get_last_comments() {
		$.ajax({
			url: location.href + "/get_last_comments",
			success: function(data) {
				if (data.success) {
					var text = "";
					for (var i = 0; i < data.comments.length; i++) {
						text += "<div class='last_comment'>";
						text += "<div class='comment_author'>";
						text += data.comments[i].name.replace(/<\/?[^>]+>/g,'');
						text += "</div>";
						text += "<div class='comment_text'>";
						text += data.comments[i].text.replace(/<\/?[^>]+>/g,'');
						text += "</div>";
						text += "<div class='comment_publish_time'>";
						text += timeConverter(data.comments[i].time);
						text += "</div></div><br>";
					}
					$("#last_comments").html("<b><center>Last comments</center></b><br>" + text);
				} else {
					$("#last_comments").html("Can't load comments.");
				}
			}
		});
	}

});