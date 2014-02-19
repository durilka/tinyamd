#tinyamd X

Teeny tiny AMD manager

###Why use tinyamd X<sup>&#8902;</sup>?

You like AMD design but not sure you need async loading (you can live with async initialization) 
and custom minification tools

###What does it support?

- Pretty much standard AMD implementation 
plus
- No need to put each module into separate file
- Browser loads (compressed) scripts and initializes modules as their dependenices become available
- Id (this is somewhat breaking from the canonic AMD specification) is just an id to use in dependencies

###How does it work?

Load your scripts normally with script tags - minimized (no matter how) or not. Modules get initialized as soon as their 
dependencies are met. Basically the manager will wait certain time (default 50 attempts with 50ms interval, 
i.e. up to 2500ms) for the each dependency to register. So far I've never actually needed the require() call.

###Example!
It's a mashup from the tests, btw.

in your html:
```html
<head data-main="globals"> <!-- this indicates what module tinyAMDx will load first -->
...
  <!-- load those earliest possible -->
  <script type="text/javascript" src="tinyamdx.js"></script>  
  <script type="text/javascript">
    define('globals', function() {
      tinyamd.shim('jquery', '$');
    });
  </script>
</head>
<body>
...
  <script type="text/javascript" src="Teamwork/tinyamd/tests/main.js"></script>    
  <script type="text/javascript" src="Teamwork/tinyamd/tests/module1.js"></script>    
  <script type="text/javascript" src="Teamwork/tinyamd/tests/module2.js"></script>    
  <script type="text/javascript" src="Teamwork/tinyamd/tests/module3.js"></script>    
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>    
</body>
```

in some js file:
```javascript
define('main', ['module1', 'jquery'], function (module1, $) {
  $(document).ready(function() {  
      $("#result").text(module1.output());
  });
});
...
```



###TODO
- Proper automatic shims from configuration
- Anonymous modules (they should work without being followed by the one with an Id)

###What did it start from?

Brian Cray's [tinyAMD](https://github.com/briancray/tinyamd)

And a desire to introduce into a big and complex somewhat-modular application concept of dependencies.

<sup>&#8902;</sup> Proper name pending
