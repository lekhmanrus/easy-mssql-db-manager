'use strict';
 
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('bower-install', 'install bower components', function() {
    var done = this.async();
    var puts = function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if(error)
        console.log('exec error: ' + error);
      done();
    };
    require('child_process').exec('bower install', {cwd: './out'}, puts);
  });

  grunt.config.set('clean', {
    out: [ 'out' ]
  });

  grunt.config.set('copy', {
    sources: {
      cwd: 'assets',
      expand: true,
      src: '**',
      dest: 'out'
    },
    bower: {
      expand: true,
      src: 'bower.json',
      dest: 'out'
    }
  });

  grunt.config.set('wiredep', {
    app: {
      src: 'out/index.html',
      cwd: 'out'
    }
  });

  var htmlBuildOptions = {
    logOptions: true,
    relative: true,
    beautify: true,
    prefix: ' ',
    scripts: {
      bundle: [
        'out/js/*.js',
        'out/js/controllers/*.js',
        'out/js/services/*.js',
        'out/js/directives/*.js'
      ]
    },
    styles: {
      bundle: 'out/css/*.css'
    }
  };

  grunt.config.set('htmlbuild', {
    index: {
      src: 'assets/index.html',
      dest: 'out/index.html',

      options: htmlBuildOptions
    }
  });

  grunt.config.set('nodewebkit', {
    options: {
      build_dir: './build',
      mac: false,
      win: true,
      linux32: true,
      linux64: true,
      version: '0.9.2'
    },
    src: ['./out/**/*']
  });

  grunt.config.set('watch', {
    src: {
      files: [ 'assets/**/**/**' ],
      tasks: [ 'make' ],
    },
    bower: {
      files: [ 'bower.json' ],
      tasks: [ 'make' ]
    }
  });

  grunt.config.set('connect', {
    app: {
      options: {
        hostname: 'localhost',
        port: 8888,
        base: 'out',
        keepalive: true,
        open: {
          target: 'http://localhost:8888',
          app: 'start',
          callback: function() { }
        }
      }
    }
  });

  grunt.config.set('parallel', {
    mix: {
      options: {
        stream: true
      },
      tasks: [{
        grunt: true,
        args: ['watch']
      }, {
        grunt: true,
        args: ['connect']
      }]
    }
  });
  
  grunt.registerTask('make', [
    'clean',
    'copy',
    'bower-install',
    'htmlbuild',
    'wiredep'
  ]);

  grunt.registerTask('build', [
    'make',
    'nodewebkit'
  ]);

  grunt.registerTask('web', [
    'make',
    'connect'
  ]);

  grunt.registerTask('default', [
    'make',
    'parallel'
  ]);

};