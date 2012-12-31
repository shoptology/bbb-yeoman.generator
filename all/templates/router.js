define([
    // Application.
    'app' //,

    // Modules
    // 'modules/...'
],
function(app) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index'
        },

        initialize : function () {
            app.useLayout( 'main' ).render();
        },

        index: function() {}
    });

    return Router;

});
