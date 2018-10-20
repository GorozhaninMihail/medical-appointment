/**
 * MedicalCentreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  all_centres: async function(req, res) {
    let centreList = await MedicalCentre.find();
    return res.json(centreList);
  }
};

