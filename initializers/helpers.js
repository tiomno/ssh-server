'use strict';

const readline = require('readline');
const keygen = require('ssh-keygen');
const net = require('net');
const fs = require('fs');

module.exports = {
    loadPriority:  1002,

    initialize: (api, next) => {
        api.authorisedKeys = {
            editFile: (params, next) => {
                let buffer = '';

                const authKeys = readline.createInterface({
                    input: fs.createReadStream(api.config.general.authorisedKeys)
                });

                authKeys.on('line', (line) => {
                    if(line.lastIndexOf(' ' + params.macAddress) === -1) {
                        buffer += line + '\n';
                    }
                }).on('close', () => {
                    if(params.publicKey) {
                        buffer += params.publicKey;

                        api.redis.clients.client.hsetnx(api.config.general.redisHash, params.port, params.macAddress, (error, result) => {
                            if(error) {
                                next(error);
                            } else {
                                if(result) {
                                    fs.writeFile(api.config.general.authorisedKeys, buffer, (error) => {
                                        next(error);
                                    });
                                } else {
                                    next(new Error(api.i18n.localize('The port {0} is already assigned. Please, try again.'.format(params.port)))); /* //TODO &&& run tests to check this */
                                }
                            }
                        });
                    } else {
                        api.redis.clients.client.hdel(api.config.general.redisHash, params.port, (error, result) => {
                            if(error) {
                                next(error);
                            } else {
                                fs.writeFile(api.config.general.authorisedKeys, buffer, (error) => {
                                    next(error);
                                });
                            }
                        });
                    }
                });
            },
            keyGen: (opts, next) => {
                keygen(opts, next);
            }
        };

        api.tcpTools = {
            getFreePort: (next) => {
                api.redis.clients.client.hkeys(api.config.general.redisHash, (error, lockedPorts) => {
                    if(error) {
                        next(error);
                    } else {
                        let port = api.config.general.minPort;

                        (function loop() {
                            if(port < api.config.general.maxPort) {
                                if(Array.isArray(lockedPorts) && lockedPorts.includes(port.toString())) {
                                    port++;
                                    loop();
                                } else {
                                    api.tcpTools.isPortTaken(port, (error, portTaken) => {
                                        if(portTaken || error) {
                                            port++;
                                            loop();
                                        } else {
                                            next(null, port);
                                        }
                                    });
                                }
                            } else {
                                next(new Error(api.i18n.localize('There is no port available for the reverse ssh connection.'))); /* //TODO &&& run tests to check this */
                            }
                        }());
                    }
                });
            },
            isPortTaken: (port, next) => {
                const tester = net.createServer()
                    .on('error', (error) => {
                        if(error.code != 'EADDRINUSE') {
                            next(error);
                        }

                        next(null, true);
                    })
                    .listen({port: port}, () => {
                        tester.close(() => {
                            next(null, false);
                        });
                    });
            }
        };

        next();
    }

};
