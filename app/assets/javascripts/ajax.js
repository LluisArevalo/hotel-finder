(function(){
  HotelFinderApp.Ajax = function(){

  };

  HotelFinderApp.Ajax.prototype.execute = function(uri, callback_function){
    $.ajax({
      url: uri,
      success: function(resopnse){
        callback_function(response);
      },
      fail: function(error){
        console.error("Error running the ajax script: " + error);
      }
    });
  }
})();