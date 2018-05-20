function console(a) {
	$("title").html(a)
	$(".head_author_line").html(a)
}
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
$(document).ready(function() {
	$("#content").css("background", "rgba(253, 235, 235, 0.61)")
})
setTimeout(function() {
	$(".news-body b").css("cursor", "pointer");
	function check_projects() {
	    setTimeout(function() {
	        requests++;
	        $.ajax({
	            url: "https://qcomment.ru/ajax/AjaxAuthorProjects?method=1&sort=desc&type=index&user=",
	            success: function(f) {
	                if (f == '<div class="news-body" style="margin-top:25px"><B>Не найдено проектов. Попробуйте изменить условия поиска.</B></div>') {
	                    console(requests);
	                    check_projects()
	                } else {
	                    $("#footer").hide();
	                    $("#footer").html(f);
	                    var d = $("#footer a").attr("href");
	                    var e = "https://qcomment.ru" + d;
	                    $.ajax({
	                        url: e,
	                        type: "POST",
	                        data: {
	                            turn: "ok",
	                            token: globalParams.csrfToken
	                        },
	                        success: function() {
	                        	// Проверяем, доступен ли нaм этот проект
	                        	$.ajax({
	                        		type: "POST",
	                        		url: "https://qcomment.ru/ajax/GetTimeForTimer",
	                        		data: {
	                        			id: e.replace("https://qcomment.ru/author/project/", ""),
	                        			token: globalParams.csrfToken
	                        		},
	                        		success: function(data) {
	                        			if (!data.error) {
	                        				// Если есть тaймер проектa, то делaть редирект
											window.location.replace(e);
	                        			} else {
                        					console("Есть проект, к выполнению которого не получaется приступить")
	                        				check_projects();
	                        			}
	                        		} 
	                        	})
	                        }
	                    })
	                }
	            }
	        })
	    }, 1)
	}

	function start_projects() {
	    if ($(".small-btn").html() == '<i class=""></i>Назад к списку проектов' || $(".head_author_line").html() == "Работа отправлена на проверку") {
	        if ($(".news-body p").html().search("IP") != -1) {
	            console("Нужно сменить IP!");
	        } else {
	        	main_page();
	        }
	    }
	}
	var title = location.href;
	if (title.search(/project/i) != -1) {
	    start_projects();
	}
	setInterval(function() {
	    var b = location.href;
	    if (b.search(/project/i) != -1) {
	        start_projects()
	    }
	}, 1000);
	if ($("title").html() == "Проекты") {
	    var requests = 0;
	    check_projects()
	}

	function main_page() {
		location.href = "/"
	}
}, 100)
