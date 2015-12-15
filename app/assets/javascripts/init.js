if(window.HotelFinderApp === undefined){
  window.HotelFinderApp = {};
}

HotelFinderApp.init = function(){
  var geolocation = new HotelFinderApp.Geolocation();
  console.log("Initializing hotel finder app...");
}

$(document).on('ready', function(){
  if($(".js-load-map")[0]){
    HotelFinderApp.init();
  }
});