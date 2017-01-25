'use strict';
const should = require('should');

describe('actionhero server', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should boot the test environment', function(done) {
        process.env.NODE_ENV.should.equal('test');
        api.env.should.equal('test');
        api.id.should.not.be.undefined().and.be.a.String();
        done();
    });

    it('should retrieve server uptime via the status action', function(done) {
        api.specHelper.runAction('status', function(response) {
            response.should.not.have.property('error');
            response.uptime.should.be.above(0);
            done();
        });
    });

    it('should reply an error when the action does not exists', function(done) {
        api.specHelper.runAction('nonexistent', function(response) {
            response.should.have.property('error');
            response.error.should.equal('unknown action or invalid apiVersion');
            done();
        });
    });
});
