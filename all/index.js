
var path = require('path'),
  npm = require('npm'),
  util = require('util'),
  grunt  = require('grunt'),
  yeoman = require('../../../../');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  // setup the test-framework property, Gruntfile template will need this

  this.test_framework = 'mocha';

  this.hookFor('test-framework', { as: 'app' });

  this.appJSFile = '';
  this.configJSFile = '';

  this.desc('Affinitve version of BBB (Backbone Boilerplate Build) with Backbone.LayoutManager.');

/*
  var args = ['main'];
  this.hookFor('affin_bbb:module', {
    args: args
  });
*/

};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor (argument) {
  var cb = this.async(),
    self = this;

  console.log('Affinitve version of BBB (Backbone Boilerplate Build) with Backbone.LayoutManager.');

  var affinHello =
  '\n\033[48;5;17m                                    \033[m'+
  '\n\033[48;5;17m                \033[48;5;208m    \033[48;5;17m                \033[m'+
  '\n\033[48;5;17m                \033[48;5;208m    \033[48;5;17m                \033[m'+
  '\n\033[48;5;17m                \033[48;5;208m    \033[48;5;17m                \033[m'+
  '\n\033[48;5;17m                \033[48;5;208m    \033[48;5;17m                \033[m'+
  '\n\033[48;5;17m                                    \033[m'+
  '\n\033[48;5;17m                \033[48;5;208m    \033[48;5;17m                \033[m'+
  '\n\033[48;5;17m                                    \033[m'+
  '\n\033[m';

  console.log(affinHello);
  console.log( 'Out of the box I include the following:\n'.cyan+'JavaScript Libraries:'.green+'\n - jQuery\n - LoDash\n - Backbone\n - Backbone.LayoutManager\n - Modernizr\n'.yellow+'HTML Markup/Templates:'.green+'\n - HTML5 Boilerplate\n - Handlebars'.yellow );

  var prompts = [
    {
      name: 'compassBootstrap',
      message: 'Would you like to include Twitter Bootstrap for Compass instead of CSS?',
      default: 'Y/n',
      warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
    },
    {
      name: 'bootstrap',
      message: 'Would you like to include the Twitter Bootstrap JS plugins?',
      default: 'Y/n',
      warning: 'Yes: All Twitter Bootstrap plugins will be placed into the JavaScript vendor directory.'
    },
    {
      name: 'baDebug',
      message: 'Would you like to include JavaScript Debug: A simple wrapper for console.log?',
      default: 'Y/n',
      warning: 'Yes: JavaScript Debug will be placed into the Javascript plugins directory.'
    },
    {
      name: 'greensock',
      message: 'Would you like to include GreenSock Animation Platform (TweenMax enabled by default)?',
      default: 'Y/n',
      warning: 'Yes: GreenSock\'s GSAP library will be placed into the JavaScript vendor directory.'
    },
    {
      name: 'appName',
      message: 'Please enter the Application Name.',
      // default: 'myApp',
      default: function(value, data, done) {
        var types = ['javascript', 'js'];
        if (data.type) { types.push(data.type); }
        var type = '(?:' + types.join('|') + ')';
        // This regexp matches:
        //   leading type- type. type_
        //   trailing -type .type _type and/or -js .js _js
        var re = new RegExp('^' + type + '[\\-\\._]?|(?:[\\-\\._]?' + type + ')?(?:[\\-\\._]?js)?$', 'ig');
        // Strip the above stuff from the current dirname.
        var name = path.basename(process.cwd()).replace(re, '');
        // Remove anything not a letter, number, dash, dot or underscore.
        name = name.replace(/[^\w\-\.]/g, '');
        done(null, name);
      },
      validator: /^[\w\-\.]+$/,
      warning: 'Must be only letters, numbers, dashes, dots or underscores.',
      sanitize: function(value, data, done) {
        // An additional value, safe to use as a JavaScript identifier.
        data.js_safe_name = value.replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
        // An additional value that won't conflict with NodeUnit unit tests.
        data.js_test_safe_name = data.js_safe_name === 'test' ? 'myTest' : data.js_safe_name;
        // If no value is passed to `done`, the original property isn't modified.
        done();
      }
    },
    {
      name: 'appAuthorName',
      message: 'Please enter your name.',
      default: function(value, data, done) {
        // Attempt to pull the data from the user's git config.
        grunt.util.spawn({
          cmd: 'git',
          args: ['config', '--get', 'user.name'],
          fallback: 'none'
        }, done);
      }
    },
    {
      name: 'appAuthorEmail',
      message: 'Please enter your email address.',
      default: function(value, data, done) {
        // Attempt to pull the data from the user's git config.
        grunt.util.spawn({
          cmd: 'git',
          args: ['config', '--get', 'user.email'],
          fallback: 'none'
        }, done);
      },
      warning: 'Should be a valid email address.'
    },
    {
      name: 'appAuthorUrl',
      message: 'Please enter your homepage (if applicable)',
      default: 'none',
      warning: 'Should be a public URL.'
    }
  ];

  this.prompt(prompts, function(e, props) {
    if (e) {
      return self.emit('error', e);
    }

    self.bootstrap = true;
    self.compassBootstrap = true;
    self.includeRequireJS = true;
    self.includeRequireHM = false;
    self.baDebug = (/y/i).test(props.baDebug);
    self.greensock = (/y/i).test(props.greensock);
    self.appName = props.appName;
    self.appAuthorName = props.appAuthorName;
    self.appAuthorEmail = props.appAuthorEmail;
    self.appAuthorUrl = props.appAuthorUrl;

    self.authorString = self.appAuthorName;

    if( self.appAuthorEmail !== '' ) {
      self.authorString += ' <' + self.appAuthorEmail + '>';
    }

    if( self.appAuthorUrl !== '' ) {
      self.authorString += ' (' + self.appAuthorUrl + ')';
    }

    // we're done, go through next step
    cb();
  });
};

Generator.prototype.gruntfile = function gruntfile() {
  // this.write('foo.js', '');
  this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};

Generator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.favicon = function favicon(){
  this.copy('favicon.ico', 'app/favicon.ico');
};

Generator.prototype.instalNpmDependencies = function instalNpmDependencies () {
  var cb = this.async(),
    args = ['grunt-bump','grunt-contrib-handlebars'];

    npm.load(grunt.config('npm'), function(err) {
      if(err) {
        return grunt.log.fail.warn(err, 3);
      }

      grunt.log.writeln('Install ' + args.join(' ') + '...');

      npm.commands.install(path.resolve('.', '.'), args, function(err) {
        if(err) {
          grunt.log.error(err.stack || err);
          return grunt.log.fail.warn(err, 3);
        }

        grunt.log.ok();

        cb();
      });
    });
};

Generator.prototype.lodashFetch = function lodashFetch() {
  var cb = this.async();

  this.remote('bestiejs', 'lodash', 'v1.0.0-rc.3', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( 'lodash.js', 'app/scripts/vendor/lodash.js' );

    cb();
  });
};

Generator.prototype.backboneFetch = function backboneFetch() {
  var cb = this.async();

  this.remote('documentcloud', 'backbone', '0.9.9', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( 'backbone.js', 'app/scripts/vendor/backbone.js' );

    cb();
  });
};

Generator.prototype.backboneLayoutManagerFetch = function backboneLayoutManagerFetch() {
  var cb = this.async();

  this.remote('tbranyen', 'backbone.layoutmanager', '0.7.5', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( 'backbone.layoutmanager.js', 'app/scripts/vendor/backbone.layoutmanager.js' );

    cb();
  });
};

Generator.prototype.handlebarsFetch = function handlebarsFetch() {
  this.fetch('http://cloud.github.com/downloads/wycats/handlebars.js/handlebars-1.0.rc.1.js', 'app/scripts/vendor/handlebars.js', this.async());
};

Generator.prototype.fetchBaDebug = function fetchBaDebug() {
  // prevent the ba-debug fetch is user said NO
  if(!this.baDebug) { return; }

  var cb = this.async();

  this.remote('cowboy', 'javascript-debug', '3b8043c8a54a9842228d90f905cc5adf3bc962bd', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( 'ba-debug.js', 'app/scripts/vendor/ba-debug.js' );

    cb();
  });
};

Generator.prototype.fetchGreensock = function fetchGreensock() {
  // prevent the greensock fetch is user said NO
  if(!this.greensock) { return; }

  var cb = this.async();

  this.remote('greensock', 'GreenSock-JS', function(err, remote, files) {
    if(err) { return cb(err); }

    'TimelineLite TimelineMax TweenLite TweenMax'.split(' ')
    .forEach(function( el ) {
      var filename = el + '.js';
      remote.copy( 'src/uncompressed/' + filename, 'app/scripts/vendor/GreenSock-JS/' + filename );
    });

    remote.directory( 'src/uncompressed/easing', 'app/scripts/vendor/GreenSock-JS/easing' );
    remote.directory( 'src/uncompressed/plugins', 'app/scripts/vendor/GreenSock-JS/plugins' );

    cb();
  });
};

Generator.prototype.mainStylesheet = function mainStylesheet(){
  if ( !this.compassBootstrap ) {
    this.write('app/styles/main.css', "/* Will be compiled down to a single stylesheet with your sass files */");
  }
};

Generator.prototype.bootstrapImages = function bootstrapImages() {
  this.copy('glyphicons-halflings.png', 'app/images/glyphicons-halflings.png');
  this.copy('glyphicons-halflings-white.png', 'app/images/glyphicons-halflings-white.png');
};

Generator.prototype.fetchH5bp = function fetchH5bp() {
  var cb = this.async();

  this.remote('h5bp', 'html5-boilerplate', 'v4.0.2', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( '.htaccess', 'app/.htaccess' );
    remote.copy( '404.html', 'app/404.html' );
    remote.copy( 'robots.txt', 'app/robots.txt' );
    remote.copy( 'js/vendor/jquery-1.8.3.min.js', 'app/scripts/vendor/jquery.min.js' );
    remote.copy( 'js/vendor/modernizr-2.6.2.min.js', 'app/scripts/vendor/modernizr.min.js' );

    this.indexFile = this.readFileAsString(path.join(remote.cachePath, 'index.html'));

    cb();
  }.bind(this));
};

Generator.prototype.fetchBootstrap = function fetchBootstrap() {
  // prevent the bootstrap fetch is user said NO
  if(!this.bootstrap) { return; }

  var cb = this.async();

  // third optional argument is the branch / sha1. Defaults to master when ommitted.
  this.remote('twitter', 'bootstrap', 'v2.2.2', function(err, remote, files) {
    if(err) { return cb(err); }

    'affix alert button carousel collapse dropdown modal popover scrollspy tab tooltip transition typeahead'.split(' ')
    .forEach(function( el ) {
      var filename = 'bootstrap-' + el + '.js';
      remote.copy( 'js/' + filename, 'app/scripts/vendor/bootstrap/' + filename );
    });

    cb();
  });
};

Generator.prototype.compassBootstrapFiles = function compassBootstrapFiles() {
  // currently getting from 2 sources.
  // this is bc the one source aims to keep a 1:1 less/sass
  // comparison based on the latest bootstrap version.
  // the second is from disk
  if ( this.compassBootstrap ) {
    var cb = this.async();

    // this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');
    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap_awesome";');
    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap_responsive";');

    // copy template compass files into directory
    this.copy( 'compass_twitter_bootstrap' , 'app/styles/_compass_twitter_bootstrap.scss' );
    this.copy( 'compass_twitter_bootstrap_awesome' , 'app/styles/_compass_twitter_bootstrap_awesome.scss' );
    this.copy( 'compass_twitter_bootstrap_responsive' , 'app/styles/_compass_twitter_bootstrap_responsive.scss' );


    this.remote('jlong', 'sass-twitter-bootstrap', 'master', function(err, remote) {
      if(err) { return cb(err); }

      // copy remote v2.2.2 sass files into directory
      remote.directory('lib', 'app/styles/compass_twitter_bootstrap');

      cb();
    });
  } else {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy( 'bootstrap.css', 'app/styles/bootstrap.css' );
  }
};


Generator.prototype.writeIndex = function writeIndex() {

  var $;

  // Resolve path to index.html
  var indexOut = path.resolve('app/index.html');

  // Read in as string for further update
  var indexData = this.indexFile;

  // Prepare default content text
  var defaults = ['HTML5 Boilerplate','Twitter Bootstrap'];
  var contentText = [
    '<div class="container">',
    '            <div class="hero-unit">',
    '                <h1>Wotcha!</h1>',
    '                <p>You now have</p>',
    '                <ul>',
    '                    <li>jQuery<br><a href=\'http://api.jquery.com/\' target=\'_blank\'>Learn More</a></li>',
    '                    <li>LoDash<br><a href=\'http://lodash.com/docs\' target=\'_blank\'>Learn More</a></li>',
    '                    <li>Backbone<br><a href=\'http://backbonejs.org/\' target=\'_blank\'>Learn More</a></li>',
    '                    <li>Backbone.LayoutManager<br><a href=\'http://tbranyen.github.com/backbone.layoutmanager/\' target=\'_blank\'>Learn More</a></li>',
    '                    <li>HandlebarsJS<br><a href=\'http://handlebarsjs.com/\' target=\'_blank\'>Learn More</a></li>'
  ];

  // Strip sections of H5BP we're going to overwrite
  indexData = this.removeScript(indexData, 'plugins.js');
  indexData = this.removeScript(indexData, 'main.js');
  indexData = this.removeScript(indexData, 'modernizr-2.6.2.min.js');
  indexData = this.removeStyle(indexData, 'normalize.css');

  indexData = indexData.replace(/js\/vendor\/jquery[^"]+/g, 'scripts/vendor/jquery.min.js');

  $ = require('cheerio').load( indexData );
  $('link[href="css/main.css"]').attr('href', 'styles/main.css');

  indexData = $.html();

  // Asked for Twitter bootstrap plugins?
  if(this.bootstrap) {

    defaults.push('Twitter Bootstrap plugins');

    // Wire Twitter Bootstrap plugins (usemin: scripts/plugins.js)
    indexData = this.appendScripts(indexData, 'scripts/plugins.js', [
      'scripts/vendor/bootstrap/bootstrap-affix.js',
      'scripts/vendor/bootstrap/bootstrap-alert.js',
      'scripts/vendor/bootstrap/bootstrap-dropdown.js',
      'scripts/vendor/bootstrap/bootstrap-tooltip.js',
      'scripts/vendor/bootstrap/bootstrap-modal.js',
      'scripts/vendor/bootstrap/bootstrap-transition.js',
      'scripts/vendor/bootstrap/bootstrap-button.js',
      'scripts/vendor/bootstrap/bootstrap-popover.js',
      'scripts/vendor/bootstrap/bootstrap-typeahead.js',
      'scripts/vendor/bootstrap/bootstrap-carousel.js',
      'scripts/vendor/bootstrap/bootstrap-scrollspy.js',
      'scripts/vendor/bootstrap/bootstrap-collapse.js',
      'scripts/vendor/bootstrap/bootstrap-tab.js'
     ]);
  }

  if(this.includeRequireJS){
    defaults.push('RequireJS');
  }

  if(this.includeRequireHM){
    defaults.push('Support for ES6 Modules');
  }

  if(this.compassBootstrap){
    defaults.push('Compass, an open-source CSS authoring framework, using the Sass stylesheet language <br><a href=\'http://compass-style.org/\' target=\'_blank\'>Learn More</a> and <a href=\'http://sass-lang.com/\' target=\'_blank\'>Learn More</a>');
  }

  if(this.baDebug){
    defaults.push('JavaScript Debug: A simple wrapper for console.log <br><a href=\'http://benalman.com/projects/javascript-debug-console-log/\' target=\'_blank\'>Learn More</a>');
  }

  if(this.greensock){
    defaults.push('The GreenSock Animation Platform, a suite of tools for scripted animation. <br><a href=\'http://www.greensock.com/gsap-js/\' target=\'_blank\'>Learn More</a>');
  }

  // Iterate over defaults, create content string
  defaults.forEach(function(i,x){
    contentText.push('                    <li>' + i  +'</li>');
  });


  contentText = contentText.concat([
    '                </ul>',
    '                <p>installed.</p>',
    '                <h3>Enjoy coding! - Yeoman</h3>',
    '            </div>',
    '        </div>',
    ''
  ]);

  // Append the default content
  // indexData = indexData.replace('<body>', '<body>\n' + contentText.join('\n'));
  indexData = indexData.replace(/<p>Hello world! This is HTML5 Boilerplate.<\/p>/gi, contentText.join('\n') );

  this.indexFile = indexData;
};

// XXX to be put in a subgenerator like rjs:app, along the fetching or require.js /
// almond lib
Generator.prototype.requirejs = function requirejs(){
  var cb = this.async(),
    self = this;

  if(self.includeRequireJS){

    this.copy( 'main.js' , 'app/scripts/main.js' );
    this.copy( 'router.js' , 'app/scripts/router.js' );

    // this.remote('jrburke', 'requirejs', '2.0.5', function(err, remote) {
    this.remote('jrburke', 'requirejs', '2.1.2', function(err, remote) {
      if(err) { return cb(err); }
      remote.copy('require.js', 'app/scripts/vendor/require.js');

      // Wire RequireJS/AMD (usemin: js/amd-app.js)
      this.indexFile = this.appendScripts(this.indexFile, 'scripts/amd-app.js', ['scripts/vendor/require.js'], {
        'data-main': 'scripts/config'
      });

      // Configure Config.js:

      this.configJSFile =
        'require.config({\n' +
        '\n' +
        '    // Initialize the application with the main application file.\n' +
        '    deps: [\'main\'],\n' +
        '\n' +
        '    paths: {\n' +
        '        // JavaScript folders.\n' +
        '        vendor: \'../scripts/vendor\',\n' +
        '        components: \'../components\',\n' +
        '        modules: \'../modules\',\n' +
        '        templates: \'../templates\',\n' +
        '\n' +
        '        // Libraries.\n' +
        '        jquery: \'../scripts/vendor/jquery.min\',\n' +
        '        lodash: \'../scripts/vendor/lodash\',\n' +
        '        backbone: \'../scripts/vendor/backbone\',\n' +
        '        handlebars: \'../scripts/vendor/handlebars\'';

        if( self.greensock ){
          this.configJSFile += ',\n' +
            '        tweenmax: \'../scripts/vendor/GreenSock-JS/TweenMax\'\n' +
            '    },\n';
        }
        else {
          this.configJSFile += '\n' +
            '    },\n';
        }

        this.configJSFile += '\n' +
          '    shim: {\n' +
          '        // Backbone library depends on lodash and jQuery.\n' +
          '        backbone: {\n' +
          '            deps: [\'lodash\', \'jquery\'],\n' +
          '            exports: \'Backbone\'\n' +
          '        },\n' +
          '        handlebars: {\n' +
          '            deps: [],\n' +
          '            exports: "Handlebars"\n' +
          '        }';

        if( self.greensock ){
          this.configJSFile += ',\n'+
            '        tweenmax: {\n' +
            '            deps: [],\n' +
            '            exports: \'TweenMax\'\n' +
            '        },\n' +
            '\n';
        }
        else {
          this.configJSFile += ',\n' +
            '\n';
        }

        if( self.baDebug ){
          this.configJSFile +=
            '        \'vendor/ba-debug\': [],\n' +
            '\n';
        }

        this.configJSFile +=
          '        \'vendor/modernizr.min\': [],\n' +
          '\n' +
          '        // Backbone.LayoutManager depends on Backbone.\n' +
          '        \'vendor/backbone.layoutmanager\': [\'backbone\']\n' +
          '    }\n' +
          '\n' +
          '});';

        // Configure App.js

        this.appJSFile =
          'define([\n' +
          '    // Libraries.\n' +
          '    \'jquery\',\n' +
          '    \'lodash\',\n' +
          '    \'backbone\',\n' +
          '    \'handlebars\',\n';

          if( self.greensock ){
            this.appJSFile +=
              '    \'tweenmax\',\n';
          }

          this.appJSFile +=
            '\n' +
            '    // Plugins.\n' +
            '    \'vendor/backbone.layoutmanager\'';

          if( self.greensock ){
            this.appJSFile += ',\n' +
              '    \'vendor/ba-debug\'\n],\n' +
              'function($, _, Backbone, Handlebars, TweenMax) {\n';
          }
          else{
            this.appJSFile += '\n],\n' +
             'function($, _, Backbone, Handlebars) {\n';
          }

          this.appJSFile +=
            '\n' +
            '    // Provide a global location to place configuration settings and module\n' +
            '    // creation.\n' +
            '    var app = {\n' +
            '        // The root path to run the application.\n' +
            '        root: \'/\'\n' +
            '    };\n' +
            '\n' +
            '    // Localize or create a new JavaScript Template object.\n' +
            '    var JST = window.JST = window.JST || {};\n' +
            '\n' +
            '    // Configure LayoutManager Handlebars.\n' +
            '    Backbone.LayoutManager.configure({\n' +
            '        manage: true,\n' +
            '\n' +
            '        paths: {\n' +
            '            layout: \'../templates/layouts/\',\n' +
            '            template: \'../templates/\'\n' +
            '        },\n' +
            '\n' +
            '        fetch: function(path) {\n' +
            '            var done = this.async(),\n' +
            '                JST = window.JST = window.JST || {};\n' +
            '\n' +
            '            path = path + \'.hbs\';\n' +
            '\n' +
            '            if(JST[path]) {\n' +
            '                return done(Handlebars.template(JST[path]));\n' +
            '            }\n' +
            '\n' +
            '            $.ajax({\n' +
            '                url: app.root + path,\n' +
            '                async: false\n' +
            '            }).then(function(contents) {\n' +
            '                var tmpl = Handlebars.compile(contents);\n' +
            '                done(JST[path] = tmpl);\n' +
            '            }, \'text\');\n' +
            '\n' +
            '            return JST[path];\n' +
            '        }\n' +
            '    });\n' +
            '\n' +
            '    // Mix Backbone.Events, modules, and layout management into the app object.\n' +
            '    return _.extend(app, {\n' +
            '        // Create a custom object with a nested Views object.\n' +
            '        module: function(additionalProps) {\n' +
            '            return _.extend({\n' +
            '                Views: {}\n' +
            '            }, additionalProps);\n' +
            '        },\n' +
            '\n' +
            '        // Helper for using layouts.\n' +
            '        useLayout: function(name) {\n' +
            '            // If already usinig this Layout, then don\'t re-inject into the DOM.\n' +
            '            if(this.layout && this.layout.options.template === name) {\n' +
            '                return this.layout;\n' +
            '            }\n' +
            '\n' +
            '            // If a layout already exists, remove it from the DOM.\n' +
            '            if(this.layout) {\n' +
            '                this.layout.remove();\n' +
            '            }\n' +
            '\n' +
            '            // Create a new Layout.\n' +
            '            var layout = new Backbone.Layout({\n' +
            '                template: \'../templates/layouts/\' + name,\n' +
            '                className: \'layout \' + name,\n' +
            '                id: \'layout\'\n' +
            '            });\n' +
            '\n' +
            '            // Insert into the DOM.\n' +
            '            $(\'.container\').empty().append(layout.el);\n' +
            '\n' +
            '            // Render the layout.\n' +
            '            layout.render();\n' +
            '\n' +
            '            // Cache the refererence.\n' +
            '            this.layout = layout;\n' +
            '\n' +
            '            // Return the reference, for chainability.\n' +
            '            return layout;\n' +
            '        }\n' +
            '    }, Backbone.Events);\n' +
            '\n' +
            '});\n';

      cb();
    }.bind(this));

  } else {
    cb();
  }
};

Generator.prototype.requirehm = function requirehm(){
  var cb = this.async(),
    self = this;

  if(self.includeRequireHM){

    this.remote('jrburke', 'require-hm', '0.2.1', function(err, remote) {
      if(err) { return cb(err); }
      remote.copy('hm.js', 'app/scripts/vendor/hm.js');
      remote.copy('esprima.js', 'app/scripts/vendor/esprima.js');

      // Wire RequireJS/AMD (usemin: js/amd-app.js)
      this.configJSFile = this.configJSFile.replace('paths: {', 'paths: {\n    hm: \'vendor/hm\',\n    esprima: \'vendor/esprima\',');

      cb();
    }.bind(this));

  } else {
    cb();
  }
};

Generator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.mkdir('app/modules');
  this.mkdir('app/templates');
  this.write('app/index.html', this.indexFile);
  this.write('app/scripts/app.js', this.appJSFile);
  this.write('app/scripts/config.js', this.configJSFile);
};

Generator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('test/spec');
};
