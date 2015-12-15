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
      initZoom: 13,
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

  HotelFinderApp.Geolocation.prototype.onLocation = function(){
    var latitude = parseFloat($("#lat").val()) || 40.4167754;
    var longitude = parseFloat($("#lng").val()) || -3.7037902;

    var centerMadrid = new google.maps.LatLng(latitude, longitude);

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
      var uri = '/api/point_of_interests/find_hotels_around/';
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
      delete self.currentMarkers[id]
      self.currentPois.splice(self.currentPois.indexOf(id), 1);
      currentElement.parent().remove();
    });
  }

  function hotelsFound(response){
    if(response.length > 0){
      this.hotelHandler.loadHotels(this.map, response);
    }else{
      toastr.warning('No hotels were found close enough to more than a point of interest');
    }
  }

  function autocompleteOnSuccess(autocomplete, response){
    if(response === null){
      var place = autocomplete.getPlace();
      savePointOfInterest(place, this.ajax, this.currentPois);
    }else{
      var place = generatePlace(response);
      this.currentPois.push(place.id);
    }

    if(place.geometry !== undefined && place.geometry.location){
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(this.config.zoom);

      if(this.currentMarkers[place.id] === undefined){
        var markerInfo = this.utilities.createMarkerInfo(place);
        var marker = this.utilities.createMarker(markerInfo, this.map, place.name);
        addCurrentMarker.bind(this)(place, marker);

        addPlaceToList(place);
      }

      var hiddenLatLng = $('#latLng');
      if(hiddenLatLng.val() !== undefined){
        hotelNewForm(place);
      } else {
        clearAutocompleteText();
      }
    }
  }

  function autoCompleteOnError(error){
    console.log("Error on autocomplete success: " + error);
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
    if(place.geometry === undefined){
      toastr.error('The address was not found');
    }else{
      var parameters = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name,
        address: place.formatted_address
      }

      var uri = "/api/point_of_interests";
      ajax.execute(uri, poiSaved.bind(this, currentPois), parameters, 'POST');
    }
  }

  function generatePlace(response){
    return {
      geometry: {
        location: new google.maps.LatLng(parseFloat(response.latitude), 
                                         parseFloat(response.longitude))
      },
      name: response.name,
      id: response.id,
      formatted_address: response.address
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