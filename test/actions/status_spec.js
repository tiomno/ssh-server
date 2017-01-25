'use strict';
const should = require('should');

describe('Action: status', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should show status info', function(done) {
        process.env.maxMemoryAlloted = 200;
        process.env.eventLoopDelay = 10;
        process.env.maxResqueQueueLength = 1000;

        api.specHelper.runAction('status', function(response) {
            response.nodeStatus.should.be.equal('Healthy');
            response.id.should.be.a.String();
            response.consumedMemoryMB.should.be.a.Number();
            response.eventLoopDelay.should.be.a.Number();

            response.serverInformation.should.be.an.Object();
            response.serverInformation.should.have.property('serverName');
            response.serverInformation.should.have.property('apiVersion');

            response.requesterInformation.should.be.an.Object();
            response.requesterInformation.should.have.property('id').which.is.a.String();
            response.requesterInformation.should.have.property('remoteIP').which.is.equal('testServer');

            response.requesterInformation.receivedParams.should.be.an.Object();
            response.requesterInformation.receivedParams.should.have.property('action').which.is.equal('status');
            response.requesterInformation.receivedParams.should.have.property('apiVersion').which.is.a.Number();

            done();
        });
    });

    it('should show an error if the consumed memory surpasses the max memory allotted', function(done) {
        process.env.maxMemoryAlloted = 1;
        process.env.eventLoopDelay = 10;
        process.env.maxResqueQueueLength = 1000;

        api.specHelper.runAction('status', function(response) {
            response.nodeStatus.should.be.equal('Unhealthy');
            response.problems[0].should.be.equal('Using more than ' + process.env.maxMemoryAlloted + 'MB of RAM/HEAP');

            done();
        });
    });

    it('should show an error if the event loop delay surpasses the max event loop delay allowed', function(done) {
        process.env.maxMemoryAlloted = 200;
        process.env.eventLoopDelay = .00001;
        process.env.maxResqueQueueLength = 1000;

        api.specHelper.runAction('status', function(response) {
            response.nodeStatus.should.be.equal('Unhealthy');
            response.problems[0].should.be.equal('EventLoop Blocked for more than ' + process.env.eventLoopDelay + 'ms');

            done();
        });
    });

    it('should show an error if Resque Queues surpasses the max number of jobs allowed', function(done) {
        process.env.maxMemoryAlloted = 200;
        process.env.eventLoopDelay = 10;
        process.env.maxResqueQueueLength = -1;

        api.specHelper.runAction('status', function(response) {
            response.nodeStatus.should.be.equal('Unhealthy');
            response.problems[0].should.be.equal('Resque Queues over ' + process.env.maxResqueQueueLength + ' jobs');

            done();
        });
    });
});
