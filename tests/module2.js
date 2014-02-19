define('module2', ['module3'], function (module3) {
    return {
        output: function () {
            return module3.name;
        }
    };
});
