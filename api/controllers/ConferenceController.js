/**
 * ConferenceController
 *
 * @description :: Server-side logic for managing conferences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	startConference:  function (req, res) {
    var id = req.param('id')
    console.log(id)
    return res.view('conference', {
      conferenceId: id
    });

  }
};

