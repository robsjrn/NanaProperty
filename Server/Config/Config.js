var Config = {};
Config.PM={};//property manager
Config.PL={};//property Lister
Config.PB={};//property Both manager and Lister

Config.JobConfig="'00 15 4 * * 0-6'"; //this is Every second
Config.AppUrl="104.131.100.150:4000";
Config.TenantWelcomeMsg="You Have Been Registered as a Tenant in One of Our Property for More Information Visit Us at http://104.131.100.150 use your id as username and Password";
Config.DatabaseUrl="mongodb://127.0.0.1:27017/RentalDB";
Config.tokenSecret='1234567890QWERTY';
Config.Tenant={
             "Homepage":"/Tenant.html",
             "role":"propertyListing",
             "userrole":{ "userRole" : {
                "id" : 3,
                "role" : "tenant"
                    }}
};

Config.PL={
		 "Homepage":"/Account-PropertyListing.html",
       "role":"propertyListing",
		 "userrole":{ "userRole" : {
					 "id" : 2,
					 "role" : "admin"
                    }}		
			
			};
			
Config.PM={
	   	 "Homepage":"/property-Admin.html",	
          "role":"landlord",
          "userrole":{ 
					 "id" : 1,
					 "role" : "propertyAdmin"
                    }
 };

module.exports = Config




