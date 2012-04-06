module.exports = function(grunt) {
  grunt.initConfig({
    lint: { all: ['js/*.js'] },
    concat: { 'build/device.js': ['js/*.js'] },
    min: { 'build/device.min.js': ['device.js'] },
  });

  // Your grunt code goes in here.
  grunt.registerTask('default', 'lint concat min');
};
