'use strict';

exports.createTerminal = {
    name: 'createTerminal',
    description: 'Creates a shell terminal on the server',

    outputExample: {},

    inputs: {
        port: {
            required: true,
            validator: function(param, data) {
                const port = parseInt(param);
                const api = this;

                if(port >= api.config.general.minPort && port <= api.config.general.maxPort) {
                    return true;
                } else {
                    return new Error(data.connection.localize('The port provided is not valid.'));
                }
            },
            formatter: function(param) {
                return parseInt(param);
            }
        }
    },

    run: function(api, data, next) {
        api.log('creating room: ' + 'ssh-room-' + data.params.port); /* //TODO &&& rm  */

        /* //TODO &&& add code to check for the open port and connect it via SSH, try 5 times and return timeout otherwise. */

        api.chatRoom.add('ssh-room-' + data.params.port, next);
    }

};
