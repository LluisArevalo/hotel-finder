(function(){
  "use strict";
  var map;
  var ajax;
  var utilities;

  HotelFinderApp.Hotels = function(){
    this.ajax = new HotelFinderApp.Ajax();
    this.utilities = new HotelFinderApp.Utilities(true);
  };

  HotelFinderApp.Hotels.prototype.loadHotels = function(googleMap, hotels){
    var self = this;
    var centerMadrid = new google.maps.LatLng(40.4167754, -3.7037902);
    
    this.map = googleMap;
    var request = {
      location: centerMadrid,
      radius: '5000',
      query: 'hotel'
    };
    
    hotels.forEach(function(hotel){
      self.utilities.createMarker(self.utilities.createMarkerInfo(hotel), self.map, hotel.name);
    });
  };

  function saveHotel(hotel, ajax){
    var parameters = {
      name: hotel.name,
      address: hotel.formatted_address,
      lat: hotel.geometry.location.lat(),
      lng: hotel.geometry.location.lng()
    }

    var uri = '/api/hotels';
    ajax.execute(uri, onHotelSaved, parameters, 'POST');
  }

  function onHotelSaved(){
    console.log("Hotel saved on the database");
  }
})();