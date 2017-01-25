'use strict';
const assert = require('assert');
const botMock = require('../botkit-mock/botMock');

  describe('test default response for actions', ()=>{
        beforeEach((done)=>{
            let self = this;
            self.bot = new botMock.bot();
            done();
        });

        it('should return data.ok for users.list call', (done)=>{
            let self = this;
            self.bot.api.callAPI('users.list', {}, (err, data)=>{
                assert.equal(data.ok, true)
                done()
            })
        });

        it('should return data.ok for channels.info call', (done)=>{
            let self = this;
            self.bot.api.callAPI('channels.info', {channel: 'C0VHNJ7MF'}, (err, data)=>{
                assert.equal(data.ok, true)
                done()
            })
        });
    });

    describe('change api data for action with overriding', ()=>{
        beforeEach((done)=>{
            let self = this;
            self.bot = new botMock.bot();
            self.bot.updateApiByKey('users.list', {members: [{id: '2'}]});
            self.bot.updateApiByKey('channels.info', {channel1: {id: '2'}});
            done();
        });

        it('should return newly changed api data in users.list call', (done)=>{
            let self = this;
            self.bot.api.callAPI('users.list', {}, (err, data)=>{
                assert.equal(data.members[0]['id'], '2')
                done()
            })
        });

        it('should return newly changed api data in channels.info call', (done)=>{
            let self = this;
            self.bot.api.callAPI('channels.info', {channel: 'channel1'}, (err, data)=>{
                assert.equal(data.id, '2')
                done()
            })
        });
    });

    describe('change api data for action with extending', ()=>{
        beforeEach((done)=>{
            let self = this;
            self.bot = new botMock.bot();
            let temp = self.bot.getApiByKey('users.list');
            temp['members'].push({id: '3'});
            self.bot.updateApiByKey('users.list', temp);

            temp = self.bot.getApiByKey('channels.info');
            temp['channel1'] = {}
            temp['channel1'].new_field = '3';
            self.bot.updateApiByKey('channels.info', temp);
            done();
        });

        it('users.list call', (done)=>{
            let self = this;
            self.bot.api.callAPI('users.list', {}, (err, data)=>{
                console.log(data)
                assert.equal(data.members[1]['id'], 'member1');
                done()
            });
        });

        it('channels.info call', (done)=>{
            let self = this;
            self.bot.api.callAPI('channels.info', {channel: 'channel1'}, (err, data)=>{
                assert.equal(data.new_field, '3');
                done()
            })
        });
    });

