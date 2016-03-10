## InstaConfernce  - A demo Tropo conferencing application

To get it running:

The TropoScript directory contains the Tropo script you need to deploy on Tropo.com.  
You need to change the CONFERENCE_APP_URL parameter in the script to point to this web app or it won't work.  If running this on your local machine you can use something like ngrok.

When running the app you will need to export the following configuration parameters:

* TROPO_API_KEY - Your tropo API key that points to the conference.js Tropo Scripting application (required)
* LDAP_BASE_DN  - Base DN to search (if using ldap)
* LDAP_BIND_DN  - The Bind DN when connecting to ldap
* LDAP_USERNAME - The Username to connect to ldap with
* LDAP_PASSWORD - The password to use when connecting to ldap
* LDAP_SERVER_URL - the ldap server url



```
Example:

export TROPO_API_KEY ="11bde1f893c1f899862c10e540c6790e8cb088f6b5f66fa47b60fe2a0056792d121a7f9f48d7bf7995a76602"
export LDAP_BASE_DN  - "OU=Employees,OU=Users,DC=company,DC=com"
export LDAP_BIND_DN  = "DC=company,DC=com"
export LDAP_USERNAME = "company\\ldapuser"
export LDAP_PASSWORD = "password"
export LDAP_SERVER_URL = "ldap://ds.company.com:389/"
```


