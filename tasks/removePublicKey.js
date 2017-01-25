'use strict';

exports.task = {
    name: 'removePublicKey',
    description: 'Removes an SSH session public key',
    frequency: 0,
    queue: 'default',
    middleware: [],

    run: function(api, params, next) {
        api.authorisedKeys.editFile(params, function(error) {
            next(error);
        });
    }
};
