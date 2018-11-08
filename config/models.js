/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {
  //schema: true,
  migrate: 'safe',

  attributes: {
    id: { type: 'number', autoIncrement: true, },
  },

  dataEncryptionKeys: {
    default: 'NExjtek0MaxAOzOA9Rg6Jv4MtZfc64c68Q4isuXFBvE='
  },

  cascadeOnDestroy: true

};
