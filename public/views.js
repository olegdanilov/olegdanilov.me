$(".content").hide(); // Hide all content before it load
$(document).ready(function() {

	// Main functions

	main = {
		timeConverter: function(UNIX_timestamp) {
			var a = new Date(UNIX_timestamp * 1000);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ' ' + month + ', ' + year + ' at ' + hour + ':' + min + ':' + sec ;
			return time;
		},
		getCookie: function(name) {
			var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}
	}

	content = {
		render_article: function() {
			$.ajax({
				url: location.href + "/content",
				success: function(result) {
					if (result.success) {
						$(".title").html(result.data[0].title);
						$("title").html(result.data[0].title + " - Oleg Danilov");
						$(".text").html(result.data[0].text);
						$(".time").append(main.timeConverter(result.data[0].time));
						$(".time_edited").append(main.timeConverter(result.data[0].time_edited));
						$(".like").html(result.rating.like);
						$(".dislike").html(result.rating.dislike);
						$(".views").append("<div class='text_views'>" + result.rating.views + "</div>");
						$("a").each(function() {
							$(this).addClass("waves-effect");
						});
						content.render_comments();
					} else {
						$(".loading_lable").html(result.error.description);
					}
				}
			});
		},
		render_comments: function() {
			$.ajax({
				url: location.href + "/getComments",
				success: function(data) {
					if (data.comments.lenght < 1) {
						$(".coments").remove();
					}
					var text = "";
					for (var i = 0; i < data.comments.length; i++) {
						text += '<div class="comment">';
						text += '<div class="name">';
						text += data.comments[i].name.replace(/<\/?[^>]+>/g,'');
						text += '</div>';
						text += '<div class="text">';
						text += data.comments[i].text.replace(/<\/?[^>]+>/g,'');
						text += '</div>';
						text += '<div class="time">';
						text += main.timeConverter(data.comments[i].time);
						text += '</div></div><br>';	
						$(".grecaptcha-badge").hide();
					}
					$(".coments").html(text);
					// Preloader
					$("#preloader-main").hide();
					$(".content").fadeIn("slow");
					$("nav").fadeIn("slow");
					// Show content
				}
			});
		},
		init_rating: function() {
			$(".like_img").click(function() {
				var news_id = location.href.replace("https://olegdanilov.me/news/", "");
				$.ajax({
					url: "/news/" + news_id + "/rateNews/1",
					success: function(data) {
						if (data.success) {
							Materialize.toast("Yоu liked it!", 3000);
						} else {
							Materialize.toast(data.error.description, 3000);
						}
					}
				});
			});

			$(".dislike_img").click(function() {
				var news_id = location.href.replace("https://olegdanilov.me/news/", "");
				$.ajax({
					url: "/news/" + news_id + "/rateNews/0",
					success: function(data) {
						if (data.success) {
							Materialize.toast("Yоu disliked it!", 3000);
						} else {
							Materialize.toast(data.error.description, 3000);
						}
					}
				});
			});
		}
	}

	user = {
		getFingerPrint: function() {
			new Fingerprint2().get(function(result, components) {
				return result;
			});
		}
	}

	content.render_article();
	content.init_rating();

});

$(document).ajaxError(function(e, xhr, opt){
    Materialize.toast("An error has occured!<br>: " + opt.url + " " + xhr.status, 5000);
});