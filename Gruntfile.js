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
      if(error) {
        console.log('exec error: ' + error);
      }
      done();
    };
    require('child_process').exec('bower install', {cwd: './out'}, puts);
  });

  grunt.registerTask('npm-install', 'install the application dependencies', function() {
    var done = this.async();
    var puts = function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if(error) {
        console.log('exec error: ' + error);
      }
      done();
    };
    require('child_process').exec('npm install', {cwd: './out'}, puts);
  });

  grunt.config.set('clean', {
    out: [ 'out' ]
  });

  grunt.registerTask('server-run', 'run express server', function() {
    var done = this.async();
    var puts = function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if(error) {
        console.log('exec error: ' + error);
      }
      done();
    };
    require('child_process').exec('node www', {cwd: './bin'}, puts);
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
    }
  });

  grunt.config.set('wiredep', {
    app: {
      src: 'out/index.html',
      cwd: 'out'
    }
  });

  grunt.config.set('htmlbuild', {
    app: {
      src: 'assets/index.html',
      dest: 'out/index.html',
      options: {
        logOptions: true,
        relative: true,
        beautify: true,
        prefix: ' ',
        scripts: {
          bundle: [
            'out/js/*.js',
            'out/js/controllers/*.js',
            'out/js/directives/*.js',
            'out/js/services/native/*.js',
            'out/js/services/express/*.js',
            'out/js/services/*.js',
            'out/js/filters/*.js'
          ]
        },
        styles: {
          bundle: 'out/css/*.css'
        }
      }
    }
  });

  grunt.config.set('nodewebkit', {
    options: {
      buildDir: './build',
      mac: true,
      win: true,
      linux32: true,
      linux64: true,
      version: '0.11.0'
    },
    out: ['./out/**/*']
  });

  grunt.config.set('watch', {
    assets: {
      files: [ 'assets/**/**' ],
      tasks: [ 'make' ],
    },
    bower: {
      files: [ 'bower.json' ],
      tasks: [ 'make' ]
    }
  });

  grunt.config.set('open', {
    dev: {
      path: 'http://localhost:' + (require('./package.json').httpPort || process.env.PORT || 3000)
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
        args: ['server-run']
      }]
    }
  });
  
  grunt.registerTask('make', [
    'clean',
    'copy',
    'npm-install',
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
    'open'
  ]);

  grunt.registerTask('default', [
    'make',
    'open',
    'parallel'
  ]);

};