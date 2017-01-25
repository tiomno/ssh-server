'use strict';

exports.sshKeyGen = {
    name: 'sshKeyGen',
    description: 'Generates a pair of private/public ssh keys',

    outputExample: {},

    inputs: {
        macaddress: {
            required: true,
            formatter: (param) => {
                return String(param).toLowerCase().replace(/[^\w\s]/gi, '');
            }
        },
        timeout: {
            required: true,
            validator: (param, data) => {
                if(parseInt(param) > 0) {
                    return true;
                } else {
                    return new Error(data.connection.localize('The timeout provided is not valid.'));
                }
            },
            formatter: (param) => {
                return parseInt(param);
            }
        }
    },

    run: (api, data, next) => {
        api.authorisedKeys.keyGen({
            location: __dirname + '/../keys/key_rsa',
            comment: data.params.macaddress
        }, (error, out) => {
            if(error) {
                next(error);
            } else {
                api.tcpTools.getFreePort((error, freePort) => {
                    if(error) {
                        next(error);
                    } else {
                        api.authorisedKeys.editFile({
                            macAddress: data.params.macaddress,
                            publicKey: out.pubKey,
                            port: freePort
                        }, (error) => {
                            if(error) {
                                next(error);
                            } else {
                                api.tasks.enqueueIn(data.params.timeout, 'removePublicKey', {
                                    macAddress: data.params.macaddress,
                                    publicKey: null,
                                    port: freePort
                                }, 'default', (error) => {
                                    if(error) {
                                        next(error);
                                    } else {
                                        data.response = {
                                            key: out.key,
                                            port: freePort
                                        };

                                        next();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

};
