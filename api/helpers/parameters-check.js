module.exports = {
  friendlyName: 'Parameters check',
  description: 'Check if parameters exist',
  sync: true,
  inputs: {
    req: {
      type: 'ref',
      required: true,
    },

    params: {
      type: 'ref',
      required: true,
    },
  },

  exits: {},

  fn(inputs, exits) {
    for (let i = 0; i < inputs.params.length; i++) {
      if (!inputs.req.body[inputs.params[i]]) {
        return exits.success({
          error: `Param ${inputs.params[i]} is undefined`,
        });
      }
    }
    return exits.success({error: null});
  },
};
