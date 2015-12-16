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

  HotelFinderApp.Utilities.prototype.createMarkerInfo = function(place, index){
    var coordinates = this.isHotel ? getCoordinatesHotel(place) : getCoordinatesPoi(place);

    return {
      cheapest: index === 0,
      coords: coordinates,
      description: place.name,
      price: place.price,
      website: place.website
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

    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    marker.addListener('click', function(){
      infoWindow.open(map, marker);
    });

    return marker;
  }

  function generateHotelMarker(markerInfo, map, name){
    var icon = generateHotelIcon(markerInfo);
    var marker = new google.maps.Marker({
      position: markerInfo.coords,
      map: map,
      icon: icon
    });

    getHotelMarkerEvent(marker, map, name, markerInfo);
    this.currentHotels.push(marker);

    return marker;
  }

  function generateHotelIcon(markerInfo){
    if(markerInfo.cheapest){
      var color = '#e41157';
    }

    // SVG Icon
    return {
      path: 'M197.4,503.5c-12.3-13.3-24.3-25.9-35.8-38.8c-29.4-32.7-58.9-65.4-87.8-98.5c-25.6-29.4-48.2-60.8-61.6-97.9 c-9.9-27.5-13.7-55.7-11.8-84.8C5.9,98.4,68.3,23,156.6,4.3C181.9-1,207.4-1.5,233,3.5C297.6,16,344.6,52,374.8,110.2 c13.7,26.4,20,54.9,20.4,84.6c0.4,29-7.6,56.1-20.3,82c-15.8,32.3-37.3,60.6-60.2,88c-23.5,28.1-47.1,56.2-70.7,84.2 c-14.1,16.7-28.3,33.2-42.4,49.8C200.4,500.3,199.2,501.6,197.4,503.5z M300.4,186.3c-2.7,0-4.6,0-6.6,0c-62.5,0-125,0-187.5,0 c-7.7,0-11.3-3.5-11.3-11.1c0-18-0.1-36,0-54c0-12.8,0.1-12.8-12.8-12.8c-8.3,0-8.6,0.3-8.6,8.8c0,44.2,0.1,88.3,0,132.5 c0,14.8,0.8,11.9,12.3,12.1c8.6,0.1,9.2-0.5,9.2-9c0-7.8,0-15.6,0-23.9c2.5,0,4.3,0,6.1,0c36.2,0,72.3,0,108.5,0 c28.5,0,57,0.1,85.5-0.1c3.8,0,5.5,0.8,5.2,5c-0.3,4.6-0.1,9.3-0.1,14c0,14.9-1.2,14.1,14.1,14c6.4,0,7.3-1,7.3-7.6 c0-31.8,0-63.7,0-95.5c0-12.3,0.1-12.3-12.2-12.3c-7.5,0-8.9,1.4-9,9.1C300.4,165.5,300.4,175.4,300.4,186.3z M283.7,173.6 c0-2,0-3.5,0-4.9c0-17.6-3.7-22.6-21.2-25.3c-10.5-1.6-21.2-1.9-31.8-2.1c-15-0.3-30-0.5-44.9,0.4c-17.4,1.1-28.4,16.1-24.4,31.9 C201.8,173.6,242.4,173.6,283.7,173.6z M133.1,123.4c-14.4-0.1-25.8,11-25.8,25.3c-0.1,14.7,11.1,26.1,25.6,26.2 c14.3,0.1,25.8-11.3,25.9-25.4C158.9,134.7,147.8,123.5,133.1,123.4z',
      fillColor: color || '#000000',
      fillOpacity: 1,
      anchor: new google.maps.Point(0,0),
      strokeWeight: 0,
      scale: 0.07
    };
  }

  function getHotelMarkerEvent(marker, map, name, markerInfo){
    var html = '<strong>' + name + '</strong>';

    if(markerInfo.price !== null){
      html += '<div>Book it from ' + markerInfo.price + ' €</div>';
    }

    if(markerInfo.website){
      html += '<a href="' + markerInfo.website + '" target="_blank">More info on the website</a>';
    }

    var infoWindow = new google.maps.InfoWindow({
      content: html
    });

    var circle = null;    
    
    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.open(map, marker);

      if(circle === null){
        circle = getRadiusCircle(marker, map);
        
        google.maps.event.addListener(infoWindow, 'closeclick', function(){
          circle.setMap(null);
          circle = null;
        });
      }
    });
  }

  function getCoordinatesHotel(place){
    return {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lng)
    }
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