if(window.HotelFinder === undefined){
  window.HotelFinder = {};
}

HotelFinder.init = function(){
  console.log("Initializing hotel finder app...");
  geolocation = new HotelFinder.Geolocation();
}

$(document).on('ready', function(){
  HotelFinder.init();
});