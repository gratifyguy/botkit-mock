'use strict';

class Data {
    constructor() {
        this.data = {
            'rtm.start': {
                online_users: []
            },
            'files.upload': {
                file: {
                    id: 'test',
                    permalink: 'test'
                }
            },
            'im.open': {
                ok: true,
                channel: {
                    id: 'test'
                }
            },
            'im.close': {

            },
            'mpim.open': {
                group: {
                    id: 1
                }
            },
            'users.getPresence': {
                data: {
                    'nonactive': {
                        'presence': 'nonactive'
                    },
                    'presence': {
                        'presence': 'active'
                    }
                },
                filter: function(params) {
                    if (params.user == 'nonactive')
                        return {
                            'presence': 'nonactive'
                        }
                    return {
                        'presence': 'active'
                    }
                }
            },
            'channels.list': {
                channels: [{
                    name: 'test_skill1',
                    id: 'test_skill1'
                }, {
                    name: 'test_skill2',
                    id: 'test_skill2'
                }, {
                    name: 'test_skill3',
                    id: 'test_skill3'
                }, {
                    name: 'test_skill4',
                    id: 'test_skill4'
                }]
            },
            'users.info': {
                user: {
                    name: 'test'
                }
            },
            'chat.update': {

            },
            'channels.info': {
                data: {
                    'C0VHNJ7MF': {
                        'ok': true,
                        'channel': {
                            'id': 'C0VHNJ7MF',
                            'name': 'admin',
                            'members': [
                                'member1',
                                'member2',
                                'member3',
                                'member4',
                                'member5'
                            ]
                        }
                    },
                    'C0HBYC9SA': {
                        'ok': true,
                        'channel': {
                            'id': 'test1id',
                            'name': 'test1name',
                            'members': [
                                'test1',
                                'test2'
                            ]
                        }
                    }
                },
                filter: function(params) {
                    return this.data[params.channel]
                }
            },
            'users.list': {
                'ok': true,
                'members': [{
                    'id': 'test1id',
                    'name': 'test1name',
                    'presence': 'active',
                    'is_bot': false
                }, {
                    'id': 'member1',
                    'name': 'member1',
                    'presence': 'active',
                    'is_bot': false

                }, {
                    'id': 'member2',
                    'name': 'member2',
                    'presence': 'active',
                    'is_bot': false

                }, {
                    'id': 'member3',
                    'name': 'member3',
                    'presence': 'active',
                    'is_bot': false

                }, {
                    'id': 'member4',
                    'name': 'member4',
                    'presence': 'active',
                    'is_bot': false

                }, {
                    'id': 'member5',
                    'name': 'member5',
                    'presence': 'active',
                    'is_bot': false

                }]
            }

        };
        this.api = {}
        this.api.callAPI = (apiName, params, callback) => {
            if (callback) {
                var dataResponse = this.data[apiName];
                if (typeof dataResponse.filter === 'function') {
                    callback(null, dataResponse['filter'](params))
                } else {
                    callback(null, dataResponse)
                }
            }
        }
    }

    getData(key) {
        return this.data[key].data ? this.data[key].data : this.data[key];
    }

    updateData(key, value) {
        if (this.data[key].data) {
            this.data[key].data = value;
        } else {
            this.data[key] = value;
        }
    }
}

module.exports = Data