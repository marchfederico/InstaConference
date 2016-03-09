module.exports = {

  search: function (req, res) {
        var searchString=''
    if (req.query && req.query.searchString)
      searchString = req.query.searchString

    if (req.body && req.body.searchString)
      searchString = req.body.searchString

    if (searchString.length > 0)
    {
      console.log("searching for "+searchString)
      LdapSearch.searchUser(searchString,function(err,results){
        if(err)
          res.send(500)
        else
          res.send(200,results)
      })
    }
    else
      res.send(200,[])
    }


};
