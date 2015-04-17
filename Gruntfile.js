var recursive = require('recursive-readdir');
var fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    initData: {},
    jade: {
      compile: {
          options: {
            data: { asyncData: '<%= initData %>' }
          },
          files: [{
              expand: true,
              cwd: 'src/demo/',
              src: ['**/*.jade'],
              dest: 'demo/',
              ext: '.html'
          }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'Opera >= 15', 'Chrome >= 4', 'Firefox >= 16', 'Safari >= 4']
      },
      css: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'src/css/*.css',
            dest: 'dist/css/'
          },
          {
            expand: true,
            flatten: true,
            src: 'src/demo/css/*.css',
            dest: 'demo/css/'
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: ['**/*.css'],
          dest: 'dist/css/',
          ext: '.css'
        }]
      }
    },
    watch: {
      files: ['src/demo/**/*.jade','src/css/**/*.css'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('readFileList', 'Lists files recursively from given path', function()
  {
    var
      dir = 'dist/css/',
      stats = null,
      done = this.async(),
      byteFormat = function(count)
      {
        var level = 0;
        while(count > 1024)
        {
          count /= 1024;
          level ++;
        }
        return (Math.round(count*100)/100)+' '+['','K','M','G','T'][level]+'B';
      }
    
    var fileList = recursive('./'+dir, function(err, files)
    {
      var fileSizes = {};
      for(var i in files)
      {
        stats = fs.statSync(files[i]);
        fileSizes[files[i].replace(/\\/g, '/').replace(dir, '')] = byteFormat(stats['size']);
      }
      grunt.config(['initData'], fileSizes);
      console.log('Found files: ', fileSizes);
      done();
    });
  });

  grunt.registerTask('default', ['readFileList','autoprefixer','cssmin','jade','watch']);

  grunt.registerTask('deploy', ['readFileList','autoprefixer','cssmin','jade']);
};