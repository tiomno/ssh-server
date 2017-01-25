'use strict';

const should = require('should');

describe('Initializer: helpers', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should show an error if Redis cannot set a hash value for api.authorisedKeys.editFile helper', function(done) {
        api.redis.clients.client.hsetnx = function(hash, port, macAddress, next) {
            next(new Error('There was an error setting the Redis hash key'));
        };

        api.authorisedKeys.editFile({
            publicKey: 'a public key',
            macAddress: '99134801FFFF',
            port: 0
        }, function(error) {
            error.message.should.be.equal('There was an error setting the Redis hash key');
            done();
        });
    });

    it('should show an error if the port is already assigned', function(done) {
        const port = 20000;

        api.redis.clients.client.hsetnx = function(hash, port, macAddress, next) {
            next(null, false);
        };

        api.authorisedKeys.editFile({
            publicKey: 'a public key',
            macAddress: '99134801FFFF',
            port: port
        }, function(error) {
            error.message.should.be.equal('The port ' + port + ' is already assigned. Please, try again.');
            done();
        });
    });

    it('should show an error if Redis cannot set a hash value', function(done) {
        api.redis.clients.client.hdel = function(hash, port, next) {
            next(new Error('There was an error deleting the Redis hash key'));
        };

        api.authorisedKeys.editFile({
            publicKey: null,
            macAddress: '99134801FFFF',
            port: 0
        }, function(error) {
            error.message.should.be.equal('There was an error deleting the Redis hash key');
            done();
        });
    });

    it('should show an error if Redis cannot get a hash keys for api.tcpTools.getFreePort helper', function(done) {
        api.redis.clients.client.hkeys = function(hash, next) {
            next(new Error('There was an error getting the Redis hash keys'));
        };

        api.tcpTools.getFreePort(function(error) {
            error.message.should.be.equal('There was an error getting the Redis hash keys');
            done();
        });
    });

    it('should show an error if all ports are taken', function(done) {
        api.config.general.maxPort = 20002;

        api.redis.clients.client.hkeys = function(hash, next) {
            next(null, ['20000', '20001', '20002']);
        };

        api.tcpTools.getFreePort(function(error) {
            error.message.should.be.equal('There is no port available for the reverse ssh connection.');
            done();
        });
    });

    it('should show an error if there are no free ports', function(done) {
        api.config.general.maxPort = 20002;

        api.redis.clients.client.hkeys = function(hash, next) {
            next(null, ['20000', '20002']);
        };

        api.tcpTools.isPortTaken = function(port, next) {
            next(null, true);
        };

        api.tcpTools.getFreePort(function(error) {
            error.message.should.be.equal('There is no port available for the reverse ssh connection.');
            done();
        });
    });
});
