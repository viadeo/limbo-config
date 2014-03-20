module.exports = {
  src: [
    'Gruntfile.js',
    'lib/**/*.js',
    'tasks/**/*.js',
    'test/**/*.js'
  ],
  options: {
    jshintrc: '.jshintrc',
    ignores: ['test/fixtures/**/*.js']
  }
};
