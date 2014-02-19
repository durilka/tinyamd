define('main', ['module1', 'jquery'], function (module1, $) {
  $(document).ready(function() {  
      $("#result").text(module1.output());
  });
});
