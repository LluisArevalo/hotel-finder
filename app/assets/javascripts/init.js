if(window.HotelFinderApp === undefined){
  window.HotelFinderApp = {};
}

HotelFinderApp.init = function(){
  var geolocation = new HotelFinderApp.Geolocation();
  console.log("Initializing hotel finder app...");
}

$(document).on('ready', function(){
  cityImageHover();
  // HotelFinderApp.init();
});

function cityImageHover(){
  
}