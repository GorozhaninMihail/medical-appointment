module.exports = {

  friendlyName: 'Parameters check',
  description: 'Check if parameters exist',
  sync: true,

  inputs: {
    req: {
      type: 'ref',
      required: true
    },
    params: {
      type: 'ref',
      required: true
    }
  },


  exits: {
  },

  fn: function (inputs, exits) {
    inputs.params.forEach(function(value) {
      if(inputs.req.body[value] === undefined)
        return exits.error("Param '" + value + "' is undefined");
    });
    return exits.success();

  }


};

