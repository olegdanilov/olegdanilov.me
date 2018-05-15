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
								Materialize.toast("Successful auth!", 5000);
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
				url: "https://olegdanilov.me/admin/" + key + "/add_news/" + $("#news_title").val() + "/" + $("#news_text").val(),
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
				url: "https://olegdanilov.me/admin/" + key + "/save_draft/" + $("#news_title").val() + "/" + $("#news_text").val(),
				success: function(data) {
					if (data.success) {
						Materialize.toast("Draft was saved!", 5000);
					} else {
						Materialize.toast("Draft wasn't saved!", 5000);
						setTimeout(cms.logout, 5000);
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
						Materialize.toast("Draft was loaded!", 5000);
					} else {
						cms.logout();
					}
				}
			}); 
		});
	}
}

main = {
	getCookie: function(name, callback) {
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		callback(matches ? decodeURIComponent(matches[1]) : undefined);
	}
}

cms.check_auth();
cms.get_draft();
setInterval(cms.save_draft, 5000);

$(".add_news").click(function() {
	cms.publish();
});

});