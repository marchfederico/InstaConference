var LdapSearch = require('simple-ldap-search')

base = sails.config.instaconference.LDAP_BASE_DN;
durl =sails.config.instaconference.LDAP_SERVER_URL;
bindDN =sails.config.instaconference.LDAP_BIND_DN;
username = sails.config.instaconference.LDAP_USERNAME;
password =sails.config.instaconference.LDAP_PASSWORD;

return_attributes =['dn', 'givenName','sn', 'cn','telephoneNumber','mobile']

if (base && durl)
  ldapSearch = new LdapSearch(durl,bindDN,username,password)
else
  ldapSearch=''

module.exports = {

  searchUser: function(name, callback) {

    if (ldapSearch)
      ldapSearch.search(name,base,return_attributes,callback);
    else
     callback(null,[])

  }

};
