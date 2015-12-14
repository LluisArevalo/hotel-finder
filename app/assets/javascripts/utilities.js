(function(){
  "use strict";
  var isHotel;
  var currentHotels;

  HotelFinderApp.Utilities = function(isHotel){
    this.isHotel = isHotel || false;
    this.currentHotels = [];
  };

  HotelFinderApp.Utilities.prototype.createMarker = function(markerInfo, map, name){
    return this.isHotel ? generateHotelMarker.bind(this)(markerInfo, map, name) : generatePoiMarker(markerInfo, map, name);
  };

  HotelFinderApp.Utilities.prototype.createMarkerInfo = function(place){
    var coordinates = this.isHotel ? getCoordinatesHotel(place) : getCoordinatesPoi(place);

    return {
      coords: coordinates,
      description: place.name
    }
  };

  HotelFinderApp.Utilities.prototype.clearHotelMarkers = function(){
    this.currentHotels.forEach(function(marker){
      marker.setMap(null);
    });

    this.currentHotels = [];
  }

  function getCoordinatesPoi(place){
    return {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }
  }

  function generatePoiMarker(markerInfo, map, name){
    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map,
      animation: google.maps.Animation.DROP
    });

    marker.addListener('click', function(){
      var infoWindow = new google.maps.InfoWindow({
        content: name
      });

      infoWindow.open(map, marker);
    });

    return marker;
  }

  function generateHotelMarker(markerInfo, map, name){
    var image = 'http://www.dinou19.es/images/hotel.png';

    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map,
      icon: image
    });

    getHotelMarkerEvent(marker, map, name);
    this.currentHotels.push(marker);

    return marker;
  }

  function getHotelMarkerEvent(marker, map, name){
    google.maps.event.addListener(marker, 'click', function(){
      var circle = getRadiusCircle(marker, map);

      var infoWindow = new google.maps.InfoWindow({
        content: name
      });

      google.maps.event.addListener(infoWindow, 'closeclick', function(){
        circle.setMap(null);
      });

      infoWindow.open(map, marker);
    });
  }

  function getCoordinatesHotel(place){
    var coordinates = getCoordenatesFromPostgis(place.latlong);

    return {
      lat: parseFloat(coordinates[0]),
      lng: parseFloat(coordinates[1])
    }
  }

  function getCoordenatesFromPostgis(latlong){
    var coordinates = latlong.replace("POINT (", "").replace(")");
    return coordinates.split(" ");
  }

  function getRadiusCircle(marker, map){
    var circle = new google.maps.Circle({
      map: map,
      radius: 1000,
      fillColor: '#e41157',
      fillOpacity: 0.1,
      strokeColor: '#999999',
      strokeOpacity: 0
    });

    circle.bindTo('center', marker, 'position');

    return circle;
  }
})();