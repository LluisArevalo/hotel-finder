(function(){
  "use strict";
  var ajax;
  var map;

  HotelFinderApp.Geolocation = function(){
    this.ajax = new HotelFinderApp.Ajax();

    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(this.onLocation.bind(this), this.onError);
    }
  }

  HotelFinderApp.Geolocation.prototype.onLocation = function(position){
    var myPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    var markerCurrentPosition = {
      coords: myPosition,
      formattedAddress: "Current location"
    }

    this.map = new google.maps.Map($('#map')[0], {
      center: markerCurrentPosition.coords,
      zoom: 15
    });

    this.setAutocomplete();
  }

  HotelFinderApp.Geolocation.prototype.setAutocomplete = function(){
    var input = $('#get-places')[0];
    var autocomplete = new google.maps.places.Autocomplete(input);
    var self = this;

    autocomplete.addListener('place_changed', function(){
      var place = autocomplete.getPlace();

      if(place.geometry.location){
        self.map.setCenter(place.geometry.location);
        self.map.setZoom(15);

        var position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }

        var marker = {
          coords: position,
          formattedAddress: place.formatted_address
        }

        createMarker(marker, self.map);
      }
    });
  }

  function createMarker(markerInfo, map){
    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map
    });
  }

  HotelFinderApp.Geolocation.prototype.onError = function(error){
    console.log("Error running the Geolocation script. Details: " + error);
  }
})();