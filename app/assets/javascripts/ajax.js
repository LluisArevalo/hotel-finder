(function(){
  HotelFinderApp.Ajax = function(){

  };

  HotelFinderApp.Ajax.prototype.execute = function(uri, callback_function, parameters, method){
    method = method || 'GET';

    $.ajax({
      url: uri,
      data: { 'ajax_parameters': parameters },
      method: method,
      dataType: 'json',
      success: function(response){
        callback_function(response);
      },
      fail: function(error){
        console.error("Error running the ajax script: " + error);
      }
    });
  };
})();