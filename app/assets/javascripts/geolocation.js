(function(){
  HotelFinder.Geolocation = function(){
    var map;

    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(this.onLocation, this.onError);
    }
  }

  HotelFinder.Geolocation.prototype.onLocation = function(position){
    
  }

  HotelFinder.Geolocation.prototype.onError = function(){

  }
})();