(function(){
  "use strict";
  var ajax;
  var map;
  var config;

  HotelFinderApp.Geolocation = function(){
    this.ajax = new HotelFinderApp.Ajax();
    this.config = {
      zoom: 15
    };

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
      zoom: this.config.zoom
    });

    this.setAutocomplete();
  }

  HotelFinderApp.Geolocation.prototype.setAutocomplete = function(){
    var input = $('#get-places')[0];
    var autocomplete = new google.maps.places.Autocomplete(input);
    var self = this;

    autocomplete.addListener('place_changed', function(){
      // TODO: Before call the getPlace() method, I have to check if the place is already in the database
      // The field used for this will be name
      // PointsOfInterest in the database:
      // name index, latitude float, longitude float
      var uri = '/api/poi/get/' + input.value;
      self.ajax.execute(uri, autocompleteOnSuccess.bind(self, autocomplete));
    });
  }

  function autocompleteOnSuccess(autocomplete, response){
    if(response === null){
      var place = autocomplete.getPlace();
      var name = place.name;

      savePointOfInterest(place, this.ajax);
    }else{
      console.log("Actions in case of not null");
    }

    if(place.geometry.location){
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(this.config.zoom);

      var marker = createMarkerInfo(place);
      createMarker(marker, this.map, name);

      addPlaceToList(name);
    }
  }

  function createMarker(markerInfo, map, name){
    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map
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

  function addPlaceToList(name){
    var list = $('#mapList').find('ul');
    var html = '<li>' + name + '</li>';

    list.append(html);
  }

  function savePointOfInterest(place, ajax){
    var parameters = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      description: place.name
    }
  }

  function poiSaved(){
    console.log("Point of interest saved correctly");
  }

  HotelFinderApp.Geolocation.prototype.onError = function(error){
    console.log("Error running the Geolocation script. Details: " + error);
  }
})();