function Storage(){
    var storage = {
        //mock api
        'replyInteractive': {
            ok: true
        },
        'rtm.start': {
            online_users: ['-1','-2','-3','-4','-5','-6','-7','-8','-9','-10','-11','-12','-13','-14','-15']
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
        'im.history': {
            ok: true,
            messages: [ {
                attachments:[{
                    actions: [{}],
                    fields: [{}]
                }]
            }]
        },
        'im.close': {

        },
        'mpim.open': {
            group: {
                id: 'g01b'
            }
        },
        'groups.create': {
            group: {
                id: 'g01b'
            }
        },
        'groups.invite': {
            group: {
                id: 'g01b'
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
                name: 'test',
                profile: {
                    email: 'tests@gmail.com'
                }
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
                'C0HBYC9SA3': {
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
                'id': 'worker_id',
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

            }, {
                'id': 'member6',
                'name': 'member6',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member7',
                'name': 'member7',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member8',
                'name': 'member8',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member9',
                'name': 'member9',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member10',
                'name': 'member10',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member11',
                'name': 'member11',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member12',
                'name': 'member12',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member13',
                'name': 'member13',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member14',
                'name': 'member14',
                'presence': 'active',
                'is_bot': false

            }, {
                'id': 'member15',
                'name': 'member15',
                'presence': 'active',
                'is_bot': false

            }]
        },
        'reactions.add': {
            ok: true
        }
    }
    return {
        process: function(url, formData, cb){
            var entity = storage[url];
            var response;
            if(!entity){
                return cb(null, null);
            }
            if(entity.filter){
                response = entity.filter(formData);
            }else{
                response = entity.data || entity;
            }
            cb((response.ok === false) ? response.error : null, response);
        },
        setData (key, value){
            if(!storage[key]){
                storage[key]= {};
            }
            storage[key].data = value;
        },
        getData (key){
            return storage[key].data || storage[key];
        },
        setFilter(key, value){
            if(!storage[key]){
                storage[key]= {};
            }
            storage[key].filter = value;
        }
    }
}

module.exports = Storage;
