'use strict';

var path = require('path');

module.exports = function (grunt) {

  // Load all tasks and their configurations
  require('load-grunt-config')(grunt, {
    config: {
      pkg: require('./package.json')
    },
    configPath: path.join(process.cwd(), 'tasks/options'),
    init: true
  });

  grunt.registerTask('default', ['jshint', 'jsbeautifier', 'mochaTest']);
  grunt.registerTask('test', ['mochaTest']);
};
