'use strict';

const pty = require('pty.js');

module.exports = {
    loadPriority:  1003,

    initialize: (api, next) => {
        api.term = {};

        const chatMiddleware = {
            name: 'terminal',
            priority: 1003,
            join: (connection, room, done) => {
                api.log(['Opening terminal `%s`', room], 'info');
                api.term[room] = pty.spawn('bash', [], {
                    name: 'xterm-color',
                    cols: 160,
                    rows: 48,
                    cwd: process.env.HOME,
                    env: process.env
                });

                api.term[room].on('data', (data) => {
                    api.log('say: ' + data); /* //TODO &&& rm  */

                    api.log('say-room: ' + room); /* //TODO &&& rm  */

                    connection.sendMessage({
                        context: 'user',
                        room: room,
                        message: data
                    });

                    // api.chatRoom.broadcast({}, room, data, (error) => {
                    //     if(error) {
                    //         api.log(['Error: the terminal output broadcast responded with `%s`', error], 'error');
                    //     }
                    // });
                });

                done();
            },
            leave: (connection, room, done) => {
                api.log(['Closing terminal `%s`', room], 'info');
                api.term[room].destroy();
                delete api.term[room];

                done();
            },
            // say: (connection, room, messagePayload, callback) => {
            //     api.log('say: ' + messagePayload.message); /* //TODO &&& rm  */
            //     callback(null, messagePayload);
            // }, /* //TODO &&& rm  */
            onSayReceive: (connection, room, messagePayload, done) => {
                api.term[room].write(messagePayload.message);
                done(null, messagePayload);
            }
        };

        api.chatRoom.addMiddleware(chatMiddleware);

        next();
    }

};
