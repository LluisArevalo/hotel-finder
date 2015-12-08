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
      var uri = '/api/poi/get/' + input.value;
      self.ajax.execute(uri, autocompleteOnSuccess.bind(self, autocomplete));
    });
  }

  function autocompleteOnSuccess(autocomplete, response){
    if(response === null){
      var place = autocomplete.getPlace();
      savePointOfInterest(place, this.ajax);
    }else{
      var place = generatePlace(response);
    }

    if(place.geometry.location){
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(this.config.zoom);

      var marker = createMarkerInfo(place);
      createMarker(marker, this.map, place.name);

      addPlaceToList(place.name);
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
      name: place.name,
      address: place.formatted_address
    }

    var uri = "/api/poi/new/";
    ajax.execute(uri, poiSaved, parameters);
  }

  function generatePlace(response){
    return {
      geometry: {
        location: new google.maps.LatLng(parseFloat(response.latitude), 
                                         parseFloat(response.longitude))
      },
      name: response.name
    };
  }

  function poiSaved(){
    console.log("Point of interest saved correctly");
  }

  HotelFinderApp.Geolocation.prototype.onError = function(error){
    console.log("Error running the Geolocation script. Details: " + error);
  }
})();