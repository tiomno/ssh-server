'use strict';

const should = require('should');

describe('Action: sshKeyGen', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should show an error if the parameters are missing', function(done) {
        api.resetConnection();

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('macaddress is a required parameter for this action');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the macaddress parameter is not provided', function(done) {
        api.resetConnection('timeout=1800000', {
            timeout: 1800000
        });

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('macaddress is a required parameter for this action');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the timeout parameter is not provided', function(done) {
        api.resetConnection('macaddress=001348026AFE', {
            macaddress: '001348026AFE'
        });

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('timeout is a required parameter for this action');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the timeout parameter is not valid', function(done) {
        api.resetConnection('macaddress=001348026AFE&timeout=no-time', {
            macaddress: '001348026AFE',
            timeout: 'no-time'
        });

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('The timeout provided is not valid.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show the private key and port to open the reverse ssh connection', function(done) {
        api.resetConnection('macaddress=001348026AFE&timeout=100', {
            macaddress: '001348026AFE',
            timeout: '100'
        });

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            should(response.error).be.Undefined('error');
            response.messageCount.should.be.equal(1);

            response.key.should.be.a.String();
            response.key.length.should.be.approximately(1675, 75);
            response.port.should.be.a.Number();

            done();
        });
    });

    it('should show an error if there is a problem updating the authorize_kes file', function(done) {
        api.resetConnection('macaddress=001348026AFE&timeout=100', {
            macaddress: '001348026AFE',
            timeout: '100'
        });

        api.authorisedKeys.editFile = (param, next) => {
            next(new Error('There was an error editing authorized_keys file'));
        };

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('There was an error editing authorized_keys file');

            done();
        });
    });

    it('should show an error if there is a problem getting a free port', function(done) {
        api.resetConnection('macaddress=001348026AFE&timeout=100', {
            macaddress: '001348026AFE',
            timeout: '100'
        });

        api.tcpTools.getFreePort = (next) => {
            next(new Error('There was an error getting a free port'));
        };

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('There was an error getting a free port');

            done();
        });
    });

    it('should show an error if there is a problem generating ssh keys', function(done) {
        api.resetConnection('macaddress=001348026AFE&timeout=100', {
            macaddress: '001348026AFE',
            timeout: '100'
        });

        api.authorisedKeys.keyGen = (opts, next) => {
            next(new Error('There was an error generating ssh keys'));
        };

        api.specHelper.runAction('sshKeyGen', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('There was an error generating ssh keys');

            done();
        });
    });
});
