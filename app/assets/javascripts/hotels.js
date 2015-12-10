(function(){
  "use strict";
  var map;
  var ajax;

  HotelFinderApp.Hotels = function(){
    this.ajax = new HotelFinderApp.Ajax();
  };

  HotelFinderApp.Hotels.prototype.loadHotels = function(googleMap){
    this.map = googleMap;

    var centerMadrid = new google.maps.LatLng(40.4167754, -3.7037902);
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: centerMadrid,
      radius: '5000',
      query: 'hotel'
    };

    service.textSearch(request, onCallback.bind(this));
  };

  function onCallback(response){
    var self = this;
    
    saveHotel(response[0], self.ajax);
    response.forEach(function(hotel){
      createMarker(createMarkerInfo(hotel), self.map, response.name);
    });
  }

  function saveHotel(hotel, ajax){
    var parameters = {
      name: hotel.name,
      address: hotel.formatted_address,
      lat: hotel.geometry.location.lat(),
      lng: hotel.geometry.location.lng()
    }

    var uri = '/api/hotel/new/';
    ajax.execute(uri, onHotelSaved, parameters);
  }

  function onHotelSaved(){
    console.log("Hotel saved on the database");
  }

  function createMarker(markerInfo, map, name){
    var image = 'http://www.dinou19.es/images/hotel.png';

    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map,
      icon: image
    });
    
    marker.addListener('click', function(){
      getInfoWindow(name).open(map, marker);
    });
  }

  function createMarkerInfo(place){
    var position = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }

    return {
      coords: position,
      description: place.name
    }
  }

  function getInfoWindow(name){
    return new google.maps.InfoWindow({
      content: name
    });
  }
})();