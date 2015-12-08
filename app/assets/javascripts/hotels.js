(function(){
  "use strict";
  var map;

  HotelFinderApp.Hotels = function(){
    
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

    response.forEach(function(hotel){
      createMarker(createMarkerInfo(hotel), self.map, response.name);
    });
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