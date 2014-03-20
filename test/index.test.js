/*global describe:false, __dirname:false, afterEach:false, it:false, xit:false, xdescribe:false*/
/*jshint -W030*/
'use strict';

var expect = require('chai').expect
  , path = require('path')
  , processCwd = process.cwd
  , ConfigurationError = require('../lib/errors/ConfigurationError');

describe('app configuration', function() {

  var config;

  afterEach(function() {
    delete require.cache[require.resolve('../lib')];
    process.cwd = processCwd;

  });

  describe('loading and validation of application config', function() {

    it('should load an existing configuration, in development mode', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj');
      };
      config = require('../lib');

      // Test a few standard configs
      expect(config._controllers).to.be.a('string');
      expect(config._assets).to.be.a('string');

      // Test overridden config
      expect(config.forbidden_routes.length).to.equal(2);
      expect(config.forbidden_routes).to.include('forbidden');
      expect(config.forbidden_routes).to.include('dev_folder');

      // Check that custom config keys were set in the development environment
      expect(config.dev_config).to.equal(true);
      expect(config.prod_config).to.be.an('undefined');
    });

    it('should load an existing configuration, in production mode', function() {
      process.env.NODE_ENV = 'production';
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj');
      };
      config = require('../lib');

      // Test a few standard configs
      expect(config._controllers).to.be.a('string');
      expect(config._assets).to.be.a('string');

      // Test overridden config
      expect(config.forbidden_routes.length).to.equal(2);
      expect(config.forbidden_routes).to.include('forbidden');
      expect(config.forbidden_routes).to.include('prod_folder');

      // Check a config set in the development environment
      expect(config.dev_config).to.be.an('undefined');
      expect(config.prod_config).to.equal(true);
    });

    it('should load the default config, when the env file does not exist', function() {
      process.env.NODE_ENV = 'doesnt_exist';
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj');
      };
      config = require('../lib');

      // Test a few standard configs
      expect(config._controllers).to.be.a('string');
      expect(config._assets).to.be.a('string');

      // Test config not overridden
      expect(config.forbidden_routes.length).to.equal(1);
      expect(config.forbidden_routes).to.include('forbidden');

      // Check a config set in the development environment
      expect(config.dev_config).to.be.an('undefined');
      expect(config.prod_config).to.be.an('undefined');
    });

    it('should load the default config if the configuration folder does not exist', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj-with-no-config');
      };
      config = require('../lib');

      // Test a few standard configs
      expect(config._controllers).to.be.a('string');
      expect(config._assets).to.be.a('string');

      // Test config not overridden
      expect(config.forbidden_routes.length).to.equal(0);

      // Check a config set in the development environment
      expect(config.dev_config).to.be.an('undefined');
      expect(config.prod_config).to.be.an('undefined');
    });

    it('should load and merge an application schema, if present', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj-with-schema');
      };
      config = require('../lib');

      // Test a few standard configs
      expect(config._root_file_name).to.equal('override-main');
    });
  });

  describe('error states', function() {

    it('should throw an exception if app doesn\'t exist exist', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj-non-existent');
      };

      expect(function() {
        require('../lib');
      }).to.throw(ConfigurationError);
    });

    it('should throw an exception if required app directories do not exist', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj-with-missing-dirs');
      };

      expect(function() {
        require('../lib');
      }).to.throw(ConfigurationError);
    });

    it('should throw an exception if the configuration is invalid', function() {
      process.cwd = function() {
        return path.resolve(__dirname, 'fixtures/proj-with-invalid-config');
      };

      expect(function() {
        require('../lib');
      }).to.throw(ConfigurationError);
    });
  });
});
