$(document).on('ready', function(){
  $("#get-places").on('focus', function(){
    $(this).parent().find("span").addClass("js-focus-color");
  });
  $("#get-places").on('focusout', function(){
    $(this).parent().find("span").removeClass("js-focus-color");
  });
});