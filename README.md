#tinyamd X

Teeny tiny AMD manager

###Why use tinyamd X?

You like AMD design but not sure you need async loading (you can live with async initialization) 
and custom minification tools

###What does it support?

- Pretty much standard AMD implementation 
plus
- No need to put each module into separate file
- Browser loads (compressed) scripts and initializes modules as their dependenices become available
- Id (this is somewhat breaking from the canonic AMD specification) is just an id to use in dependencies

###TODO
- Proper shims
- Anonymous modules (they should work without being followed by the one with an Id)

###What did it start from?

Brian Cray's [full config support](https://github.com/amdjs/amdjs-api/wiki/Common-Config)

And a desire to introduce into a big and complex not-very-modular application concept of dependencies.