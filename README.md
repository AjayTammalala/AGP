logins 
email:"pavanp@spyhre.com"
password : "Agp@2024!!"

if succesfull ....response from api  = 199 

API --"http://spyhreagpapi.local.com/Service.svc"
3 screens Project--modules--methods
1.project screen get data and binding in cards -- some are Active 'Y' Inactive 'N' Deleted 'D'  shows in action : 'Y' 'N' 'D'

2.Module screen -- it shows data in cards from get method if want to add new module it shows dropdown which contains projects which is in active state 'Y'.the creted module bind with that selected project with that P_ID  MOD_P_ID

3.methods screen -- it has no getmethods so...in module screen if user click on getmodule button on a selected card it takes that card ID and calls API and gets data...if response was empty ...we have to create a new method with that selected module ID

Projects---Module---Methods (3 has bindings)

----------------------------------------------------------------------------------------------------------------------
#projects
get -- "http://spyhreagpapi.local.com/Service.svc/GetProjects"

for adding project or update project --endpoint--"/InsertProject"
const obj = {
        "prj": {
          P_ID: 0, (Random frombackend)
          P_PEP_P_ID: 1090,
          P_PRJ_NAME: this.myform.value.projectname,
          P_API_URL_DEV: this.myform.value.devurl,
          P_API_URL_STAG: this.myform.value.stagingurl,
          P_API_URL_PROD: this.myform.value.produrl,
          P_API_URL_TEST: this.myform.value.testurl,
          P_TS: "",
          P_ACTIVE: this.checkValue,
          action: "A",                          // if action :'A' add or 'U' update
          P_U_ID: Number(localStorage.getItem("key"))
        }
      };
      
for adding delete project --endpoint--"/DeleteRecords"
const obj = {
      "prj": {
        P_ID: x.P_ID,
        action: "D",        // if action :'D' delete
      }
    };    
    
---------------------------------------------------------------------------------------------------------
    
#Modules
get modules -- "http://spyhreagpapi.local.com/Service.svc/GetmodulesInfo"

for adding module or update project --endpoint-"/AddModule"
	const obj = {
    mod: {
      MOD_ID: 0,                                   //random num series from backend
      MOD_P_ID: this.moduleForm.value.projectId,   //it takes the project which is to be binded (projects--module--methods) 
      MOD_NAME: this.moduleForm.value.name,        //A project is active it shows in module screen ...it selects fromdropdown which is  
      MOD_DESC: this.moduleForm.value.description, 
      MOD_ACTIVE: this.moduleForm.value.active ? 'Y' : 'N',
      action: 'A',
      MOD_U_ID: Number(localStorage.getItem('key')),
    }
  };

for adding delete project --endpoint--"/DeleteModule"
const obj = {
       "mod": {
    "MOD_ID": 101,
    "action": "D"
  }
  
  -------------------------------------------------------------------------
#Methods

/GetApiMethods
    const obj = {
      "md": {
        mod: 1
      }
    };

 /AddMethods
ex: const obj = {
      "m": {
        M_ID: this.userid,
        M_MOD_ID: Number(this.modulename),
        M_NAME: this.myform.value.name,
        M_DESC: this.myform.value.Description,
        M_REQUEST_URL_SAMPLE: this.myform.value.requrl,
        M_RESPONCE_URL_SAMPLE: this.myform.value.resurl,
        M_ACTIVE: this.checkValue,
        M_TYPE: "G",
        action: "A",
        M_TS: this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear()
      }
 };
 
/DeleteMethod
 
ex: const obj = {
      "m": {
        M_ID: x.M_ID,
        action: "D",
      }
    };   
