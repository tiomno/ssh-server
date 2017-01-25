'use strict';

const should = require('should');

describe('Task: removePublicKey', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should return null if the mac address is not found in the authorized_keys file', function(done) {
        const params = {
            macAddress: '991348026FFF',
            port: 20000
        };

        api.specHelper.runTask('removePublicKey', params, function(response) {
            should(response).be.Null();

            done();
        });
    });
});
