$(".content").hide(); // Hide content wile page not loaded
$(document).ready(function() {

	// Preloader
	setInterval(function() {
		$("#preloader-main").fadeOut("500")
		setInterval(function() {
			$(".content").fadeIn("500");
			// Show content
		}, 500);
	}, 500);

cms = {
	check_auth: function() {
		$("#authed").hide();
		main.getCookie("key", function(result) {
			if (result == "") {
				$("#auth").show();
				$("#auth-btn").click(function() {
					$.ajax({
						url: "https://olegdanilov.me/admin/login/" + $("#Username").val() + "/" + $("#Password").val(),
						success: function(data) {
							if (data.success) {
								Materialize.toast("Successful auth!", 1000);
								document.cookie="key=" + data.data.token;
								$("#authed").show();
								$("#auth").hide();
							} else {
								Materialize.toast("Wrong username or password!", 5000);
							}
						}
					})
				});
			} else {
				$("#auth").hide();
				$("#authed").show();
			}
		});
	},
	logout: function() {
		document.cookie="key=";
		location.reload(true);
	},
	publish: function() {
		main.getCookie("key", function(key) {
			$.ajax({
				type: "POST",
				url: "https://olegdanilov.me/admin/add_news/",
				data: {
					text: $("#news_text").val(),
					title: $("#news_title").val(),
					token: key
				},
				success: function(data) {
					if (data.success) {
						Materialize.toast("News was published!", 5000);
						$("#news_title").val("");
						$("#news_text").val("");
					} else {
						cms.logout();
					}
				}
			});
		});
	},
	save_draft: function() {
		main.getCookie("key", function(key) {
			$.ajax({
				type: "POST",
				url: "https://olegdanilov.me/admin/save_draft",
				data: {
					text: $("#news_text").val(),
					token: key,
					title: $("#news_title").val()
				},
				success: function(data) {
					if (data.success) {
						//...
					} else {
						Materialize.toast("Draft wasn't saved!", 5000);
						cms.logout();
					}
				}
			})
		});
	},
	get_draft: function() {
		main.getCookie("key", function(key) {
			$.ajax({
				url: "https://olegdanilov.me/admin/" + key + "/get_draft",
				success: function(data) {
					if (data.success) {
						$("#news_title").val(data.data.title);
						$("#news_text").val(data.data.text);
					} else {
						cms.logout();
					}
				}
			}); 
		});
	},
	get_news: function() {
		$.ajax({
			url: "https://olegdanilov.me/get_news",
			success: function(news) {
				for (var i = 0; i < news.data.length; i++) {
					var text = "";
					text += "<tr class='news_" + news.data[i].id + "'><td>";
					text += news.data[i].id;
					text += "</td><td>";
					text += news.data[i].title;
					text += "</td><td>";
					text += news.data[i].text.replace(/<\/?[^>]+>/g,'');
					text += "</td><td>";
					text += main.timeConverter(news.data[i].time);
					text += "</td><td>";
					text += "<div class='delete_news btn btn-small waves-effect' news_id='" + news.data[i].id + "'>Delete<div>";
					text += "</td><td>";
					text += "<div class='edit_news btn btn-small waves-effect' news_id='" + news.data[i].id + "'>Edit<div>";
					text += "</td></tr>"
					$(".news_list_table").append(text);
				}
				cms.init_delete_news();
				cms.init_edit_news();
			}
		});
	},
	init_delete_news: function() {
		$(".delete_news").click(function() {
			var news_id = $(this).attr("news_id");
			main.getCookie("key", function(key) {
				$.ajax({
					url: "https://olegdanilov.me/admin/" + key + "/rm_news/" + news_id,
					success: function(data) {
						if (data.success) {
							Materialize.toast("News successfuly deleted!", 5000);
						} else {
							Materialize.toast("Access denied", 5000);
						}
					}
				});
			});
		});
	},
	init_edit_news: function() {
		$(".edit_news").click(function() {
			var news_id = $(this).attr("news_id");
			main.getCookie("key", function(key) {
				$.ajax({
					url: "https://olegdanilov.me/news/" + news_id + "/content",
					success: function(data) {
						$("#news_text_edit").val(data.data[0].text);
						$(".save_edited_news").attr("news_id", news_id);
						cms.save_edited_news();
					}
				});
			});
		});
	},
	save_edited_news: function() {
		$(".save_edited_news").click(function() {
			var news_id = $(this).attr("news_id");
			main.getCookie("key", function(key) {
				$.ajax({
					type: "POST",
					url: "https://olegdanilov.me/admin/edit_news",
					data: {
						text: $("#news_text_edit").val(),
						token: key,
						news_id: news_id
					},
					success: function(data) {
						if (data.success) {
							location.reload(true);
						} else {
							Materialize.toast("Access denied!", 5000);
						}
					}
				});
			});
		});
	}
}

main = {
	getCookie: function(name, callback) {
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		callback(matches ? decodeURIComponent(matches[1]) : undefined);
	},
	timeConverter: function(UNIX_timestamp){
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
}

cms.check_auth();
cms.get_draft();
cms.get_news();
setInterval(cms.save_draft, 20000);

$(".add_news").click(function() {
	cms.publish();
});

});