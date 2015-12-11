(function(){
  "use strict";
  var ajax;
  var map;
  var config;
  var currentPois;

  HotelFinderApp.Geolocation = function(){
    this.ajax = new HotelFinderApp.Ajax();
    this.config = {
      initZoom: 14,
      zoom: 16
    };
    this.currentPois = [];

    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(this.onLocation.bind(this), this.onError);
    }
  }

  HotelFinderApp.Geolocation.prototype.onLocation = function(position){
    var centerMadrid = new google.maps.LatLng(40.4167754, -3.7037902);

    this.map = new google.maps.Map($('#map')[0], {
      center: centerMadrid,
      zoom: this.config.initZoom
    });

    this.setAutocomplete();
    this.setButtonFindHotels();
    hidePageLoader();
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

  HotelFinderApp.Geolocation.prototype.setButtonFindHotels = function(){
    var self = this;
    
    $('.find-hotels').on('click', function(event){
      var uri = '/api/poi/get_hotels_around/';
      var parameters = self.currentPois;
      self.ajax.execute(uri, hotelsFound.bind(self), parameters);
    });
  }

  function hotelsFound(response){
    var hotels = new HotelFinderApp.Hotels();
    hotels.loadHotels(this.map, response);
  }

  function autocompleteOnSuccess(autocomplete, response){
    if(response === null){
      var place = autocomplete.getPlace();
      savePointOfInterest(place, this.ajax, this.currentPois);
    }else{
      var place = generatePlace(response);
      this.currentPois.push(place.id);
    }

    if(place.geometry.location){
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(this.config.zoom);

      var marker = createMarkerInfo(place);
      createMarker(marker, this.map, place.name);

      addPlaceToList(place.name);
      clearAutocompleteText();
    }
  }

  function createMarker(markerInfo, map, name){
    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map,
      animation: google.maps.Animation.DROP
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

  function savePointOfInterest(place, ajax, currentPois){
    var parameters = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      address: place.formatted_address
    }

    var uri = "/api/poi/new/";
    ajax.execute(uri, poiSaved.bind(this, currentPois), parameters);
  }

  function generatePlace(response){
    return {
      geometry: {
        location: new google.maps.LatLng(parseFloat(response.latitude), 
                                         parseFloat(response.longitude))
      },
      name: response.name,
      id: response.id
    };
  }

  function hidePageLoader(){
    $("#loading").addClass("hidden");
  }

  function clearAutocompleteText(){
    $("#get-places").val("");
    $("button.find-hotels").removeClass("hidden");
  }

  function poiSaved(currentPois, response){
    // console.log("This: " + this);
    // console.log("Current POIS: " + currentPois);
    currentPois.push(response.id)
    console.log("Saved the point of interest in the database");
  }

  HotelFinderApp.Geolocation.prototype.onError = function(error){
    console.log("Error running the Geolocation script. Details: " + error);
  }
})();