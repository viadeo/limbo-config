module.exports = {
  app: {
    src: ['test/*.test.js'],
    options: {
      globals: ['chai', 'moment'],
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec',
      bail: true
    }
  }
};
