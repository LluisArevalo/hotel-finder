function hotelNewForm(place){
  var autocomplete = $("#get-places");
  var name = $("#name");
  var address = $("#address");
  var btn = $(".btn");
  var latLng = $("#latLng");

  name.val(place.name);
  address.val(place.formatted_address);
  autocomplete.attr("disabled", "disabled");
  btn.removeAttr("disabled");
  latLng.val(place.geometry.location.lat() + ' ' + place.geometry.location.lng());
}