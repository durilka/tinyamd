; (function (global, undefined) {
    "use strict";

    var anonymous_queue = [];
    var settings = {
        debug: true,
        maxTries: 50, 
        waitPeriod: 50
    };
    var exports = {};

    function config(config) {
        if (typeof config === 'object') {
            for (var x in config) {
                config.hasOwnProperty(x) && (settings[x] = config[x]);
            }
        }
    };

    function define(id, dependencies, factory) {
        var arg_count = arguments.length;

        if (arg_count === 1) {
            factory = id;
            dependencies = ['require', 'exports', 'module'];
            id = null;
        }
        else if (arg_count === 2) {
            if (settings.toString.call(id) === '[object Array]') {
                factory = dependencies;
                dependencies = id;
                id = null;
            }
            else {
                factory = dependencies;
                dependencies = ['require', 'exports', 'module'];
            }
        }

        if (!id) {
            id = "anonymous_" + Math.random();
            id.anonymous = true;
        }

        settings.debug && console && console.log && console.log("Starting definition of AMD module: " + id);

        if (settings.debug && exports[id] && exports[id].tinyamd === 2) { 
            console && console.warn && console.warn("Module " + id + " was already defined. Redefining if that's what you intend.");
        }

        function ready() {
            var handlers, context, module;
            if (exports[id]) {
                handlers = exports[id].handlers;
                context = exports[id].context;
            }
            module = typeof factory === 'function' ? factory.apply(null, anonymous_queue.slice.call(arguments, 0)) || exports[id] || {} : factory;
            if (!id.anonymous) {
                exports[id] = module;
            }
            
            module.tinyamd = 2;
            module.context = context;
            for (var x = 0, xl = handlers ? handlers.length : 0; x < xl; x++) {
                handlers[x](module);
            }
        };

        require(dependencies, ready, id);
    };

    define.amd = {};

    function require(modules, callback, context) {
        var loaded_modules = [], loaded_count = 0, has_loaded = false;

        if (typeof modules === 'string') {
            if (exports[modules] && exports[modules].tinyamd === 2) {
                return exports[modules];
            }
            throw new Error(modules + ' has not been defined. Please include it as a dependency in ' + context + '\'s define()');
            return;
        }

        for (var x = 0, xl = modules.length; x < xl; x++) {
            switch (modules[x]) {
                case 'require':
                    var _require = function (new_module, callback) {
                        return require(new_module, callback, context);
                    };

                    loaded_modules[x] = _require;
                    loaded_count++;
                    break;
                case 'exports':
                    loaded_modules[x] = exports[context] || (exports[context] = {});
                    loaded_count++;
                    break;
                case 'module':
                    loaded_modules[x] = {
                        id: context
                    };
                    loaded_count++;
                    break;
                case exports[context] ? exports[context].context : '':
                    loaded_modules[x] = exports[exports[context].context];
                    loaded_count++;
                    break;
                default:
                    (function (x) {
                        load(modules[x], function (def) {
                            loaded_modules[x] = def;
                            loaded_count++;
                            loaded_count === xl && callback && (has_loaded = true, callback.apply(null, loaded_modules));
                        }, context);
                    })(x);
            };
        }
        !has_loaded && loaded_count === xl && callback && callback.apply(null, loaded_modules);
    }

    function load(module, callback, context) {
        if (exports[module]) {
            if (exports[module].tinyamd === 1) {
                callback && exports[module].handlers.push(callback);
            }
            else {
                callback && callback(exports[module]);
            }
            return;
        }
        else {
            exports[module] = {
                tinyamd: 1,
                handlers: [callback],
                context: context
            };
        }

        var moduleLoaded = function () {
            settings.debug && console.log("AMD module loaded: " + module);

            var queue_item;
            if (queue_item = anonymous_queue.shift()) {
                queue_item.unshift(module);
                exports[module].tinyamd === 1 && define.apply(null, queue_item);
            }
        };

        waitForLoad(module, moduleLoaded);
    };

    function waitForLoad(module, callback) {
        var currentTries = settings.maxTries;
        function checkLoading() {
            if (--currentTries) {
                if (exports[module].tinyamd !== 2) {
                    setTimeout(checkLoading, settings.waitPeriod);
                } else {
                    callback && callback();
                }
            } else {
                throw new Error(module + ' did not appear in ' + (settings.maxTries * settings.waitPeriod) + "ms. Are we having a typo there?");
            }
        }
        checkLoading();
    }
    
    function shim(moduleName, exportedSymbol) {
        function attemptRegister() {
            if (window[exportedSymbol]) {
                tinyamd.define(moduleName, function () { return window[exportedSymbol]; });
                //TODO: unregister corresponding global?
            } else {
                setTimeout(attemptRegister, settings.waitPeriod);
            }

        }

        attemptRegister();
    }
    
    global.tinyamd = {
        config: config,
        define: global.define = define,
        require: global.require = require,
        exports: exports,
        shim: shim
    };

})(this);