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
						$(".time").html(main.timeConverter(result.data[0].time));
						$(".like").html(result.rating.like);
						$(".dislike").html(result.rating.dislike);
						$(".views").append("<div class='text_views'>" + result.rating.views + "</div>");
						$("a").each(function() {
							$(this).addClass("waves-effect");
						});
						$(".gdsdsds").attr("content", result.data[0].title + " - Oleg Danilov");
						$(".keyword").attr("content", result.data[0].title + " - Oleg Danilov");
						if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
							$("head").append('<link rel="stylesheet" type="text/css" href="https://olegdanilov.me/public/m.css">')
						} else {
							$(".news_main").css("padding-left", "12%");
							$(".news_main").css("padding-right", "12%");
						}
						content.render_comments();
						navigation();
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
						text += '</div></div>';	
						$(".grecaptcha-badge").hide();
					}
					$(".coments").html(text);
					$(".Loading").html("<text class='loading_lable'></text>");
					translate();
					// Preloader
					setInterval(function() {
						$("#preloader-main").fadeOut("500");
						setInterval(function() {
							$(".content").fadeIn("500");
							// Show content
						}, 500);
					}, 500);
				}
			});
		}
	};

	$(document).ajaxError(function() {
		Materialize.toast("<text class='unknown_error'>Something went wrong. Try again later</text>", 10000);
	});

	content.render_article();

	function navigation() {
		// Apply navigation system
		$(".nav_").each(function() {
			var it_html = $(this).html();
			$("navigation").append('<headline go_to="' + $(this).attr("go_to") + '">' + it_html + '</headline><br>');
		});
		$("navigation headline").each(function() {
			$(this).addClass("waves-effect");
			var class_nav = $(this).attr("go_to");
			$(this).html('• ' + $(this).html());
			$(this).click(function() {
				$('html, body').animate({scrollTop: $("p[go_to=" + class_nav + "]").offset().top}, 800);
			});
		});
	}

	$(".time").html(main.timeConverter(Number($(".time").html())));
	$(".like_img").click(function() {
		var news_id = location.href.replace("https://olegdanilov.me/news/", "");
		$.ajax({
			url: "/news/" + news_id + "/rateNews/1",
			success: function(data) {
				if (data.success) {
					Materialize.toast("Yоu liked it!", 4000);
					Materialize.toast(data.error.description, 4000);
				} else if (data.error.id == 3) {
					Materialize.toast(data.error.description, 4000);
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
					Materialize.toast("Yоu disliked it!", 4000);
				} else if (data.error.id == 2) {
					Materialize.toast(data.error.description, 4000);
				} else if (data.error.id == 3) {
					Materialize.toast(data.error.description, 4000);
				}
			}
		});
	});

	$(".users").each(function() {
		$(this).addClass("z-depth-2");
	});

	translate();

});

translate();

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
	if (get_lang() == "ru-RU" || get_lang() == "ru" || get_lang() == "ru-ru") {
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