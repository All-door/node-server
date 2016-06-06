$(".nav.nav-tabs a").click(function(){
  $("#section-background").css("left", "-" + $(this).parent().index() * 100 + "%");
});
