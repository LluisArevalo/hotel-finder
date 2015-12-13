(function(){
  "use strict";
  var ajax;
  var map;
  var config;
  var currentPois;
  var currentMarkers;
  var utilities;
  var hotelHandler;

  HotelFinderApp.Geolocation = function(){
    this.ajax = new HotelFinderApp.Ajax();
    this.config = {
      initZoom: 14,
      zoom: 16
    };
    this.currentPois = [];
    this.currentMarkers = {};
    this.utilities = new HotelFinderApp.Utilities();
    this.hotelHandler = new HotelFinderApp.Hotels();

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
    this.setRemoveButtonAction();
    hidePageLoader();
  }

  HotelFinderApp.Geolocation.prototype.onError = function(error){
    console.log("Error running the Geolocation script. Details: " + error);
  }

  HotelFinderApp.Geolocation.prototype.setAutocomplete = function(){
    var input = $('#get-places')[0];
    var autocomplete = new google.maps.places.Autocomplete(input);
    var self = this;

    autocomplete.addListener('place_changed', function(){
      var uri = '/api/point_of_interests/get/' + input.value;
      self.ajax.execute(uri, autocompleteOnSuccess.bind(self, autocomplete));
    });
  }

  HotelFinderApp.Geolocation.prototype.setButtonFindHotels = function(){
    var self = this;
    
    $('.find-hotels').on('click', function(event){
      var uri = '/api/point_of_interests/get_hotels_around/';
      var parameters = self.currentPois;
      self.ajax.execute(uri, hotelsFound.bind(self), parameters);
    });
  }

  HotelFinderApp.Geolocation.prototype.setRemoveButtonAction = function(){
    var self = this;

    $('body').on('click', '.remove-marker', function(event){
      var currentElement = $(event.currentTarget);
      var id = currentElement.attr("data-id");

      self.currentMarkers[id].setMap(null);
      self.currentMarkers[id] = null;
      self.currentPois.splice(self.currentPois.indexOf(id), 1);
      currentElement.parent().remove();
    });
  }

  function hotelsFound(response){
    this.hotelHandler.loadHotels(this.map, response);
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

      if(this.currentMarkers[place.id] === undefined){
        var markerInfo = this.utilities.createMarkerInfo(place);
        var marker = this.utilities.createMarker(markerInfo, this.map, place.name);
        addCurrentMarker.bind(this)(place, marker);

        addPlaceToList(place);
      }

      clearAutocompleteText();
    }
  }

  function addCurrentMarker(place, marker){
    this.currentMarkers[place.id] = marker;
  }

  function addPlaceToList(place){
    var list = $('#mapList').find('ul');
    var html = '<li>' + place.name + ' <a class="remove-marker" data-id="' + place.id + '">remove</a></li>';

    list.append(html);
  }

  function savePointOfInterest(place, ajax, currentPois){
    var parameters = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      address: place.formatted_address
    }

    var uri = "/api/point_of_interests";
    ajax.execute(uri, poiSaved.bind(this, currentPois), parameters, 'POST');
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
    currentPois.push(response.id);
    console.log("Saved the point of interest in the database");
  }
})();