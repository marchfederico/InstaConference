/**
* Participant.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var uuid = require('uuid');

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true

    },
    tropoSessionId: {
      type: 'string'
    },
    userInfo: {type: 'json'},
    callState: 'string',
    muteState: 'string',
    conference:{
      model:'conference'
    }
  },

  beforeCreate: function(values, cb) {
    values.id = uuid.v4();
    cb()
  }


};

