module.exports = {
  modify: {
    src: [
      'Gruntfile.js',
      'tasks/**/*.js',
      'lib/**/*.js'
    ],
    options: {
      config: '.jsbeautifyrc'
    }
  },

  verify: {
    src: [
      'Gruntfile.js',
      'tasks/**/*.js',
      'lib/**/*.js'
    ],
    options: {
      mode: 'VERIFY_ONLY',
      config: '.jsbeautifyrc'
    }
  }
};
