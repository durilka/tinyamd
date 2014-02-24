define('main', ['module1', 'jquery'], function (module1, $) {
  var result = "undefined";
  $(document).ready(function() {  
      result = module1.output();
      $("#result").text(result);
  });
  
  return {
    magic: function() { return result; }
  };
});

// just for fun some anonymous modules

define([], function() {
  console.log("anonymous without dependencies");
});

// this is actually interesting. The module depends on main, but full initialization
// is avalable only after $.ready was called in main. This needs a better solution
// and not jquery as dependency and handler in .ready
define(['main', 'jquery'], function(main, $) { 
  $(document).ready(function() {  
  	console.log("anonymous depending on main and the magic is: " + main.magic());
  });
});