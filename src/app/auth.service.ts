import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl="http://spyhreagpapi.local.com/Service.svc/LoginUser";
  constructor(private http : HttpClient) { }

  login(body : any): Observable<any> {
    return this.http.post(this.apiUrl, body);
  }

  
  private ApiURL="http://spyhreagpapi.local.com/Service.svc/GetProjects";

  getdatafromAPI(): Observable<any> {
    return this.http.get(this.ApiURL)
  }

  private API1="http://spyhreagpapi.local.com/Service.svc/GetUserInfo";
  getuserInfo(userID : number) : Observable<any> {
    const body = { userID }; 
    return this.http.post<any>(this.API1, body);
  }
    private API2 = "http://spyhreagpapi.local.com/Service.svc/InsertProject";

  insertProject(obj: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.API2, obj);
  }


updateProject(data: any) {
  return this.http.post(`http://spyhreagpapi.local.com/Service.svc/InsertProject`, data);
}

deleteProject(payload: any) {
  return this.http.post(`http://spyhreagpapi.local.com/Service.svc/DeleteRecords`, payload);
}


private moduleApiUrl = "http://spyhreagpapi.local.com/Service.svc/GetmodulesInfo";
private insertModuleUrl = "http://spyhreagpapi.local.com/Service.svc/AddModule";  
private updateModuleUrl = "http://spyhreagpapi.local.com/Service.svc/AddModule";  
private deleteModuleUrl = "http://spyhreagpapi.local.com/Service.svc/DeleteModule";  
private updateModuleUrl1 = "http://spyhreagpapi.local.com/Service.svc/";  

getModulesDataFromAPI() {
  return this.http.get<any[]>(this.moduleApiUrl);
}

insertModule(payload: any) {
  return this.http.post(this.insertModuleUrl, payload);
}
getmethod(endpoint: string, payload: any) {
  const url = this.updateModuleUrl1 + endpoint;
  return this.http.post(url, payload);
}
updateModule(payload: any) {
  return this.http.post(this.updateModuleUrl, payload);
}

deleteModule(payload: any) {
  return this.http.post(this.deleteModuleUrl, payload);
}

private methodApiUrl = 'http://spyhreagpapi.local.com/Service.svc/GetmethodInfo';
private addMethodUrl = 'http://spyhreagpapi.local.com/Service.svc/AddMethods';
private deleteMethodUrl = 'http://spyhreagpapi.local.com/Service.svc/DeleteMethod';
// private getMethodUrl = 'http://spyhreagpapi.local.com/Service.svc/GetApiMethods';

Getaddmethods(payload : any) : Observable<any>{
  return this.http.post(this.addMethodUrl, payload);
}

// getMethodsfromURL(payload : any) :Observable<any> {
//   return this.http.post(this.getMethodUrl, payload);
// }
getMethodsDataFromAPI() {
  return this.http.get<any[]>(this.methodApiUrl);
}

insertMethod(payload: any) {
  return this.http.post(this.addMethodUrl, payload);
}

updateMethod(payload: any) {
  return this.http.post(this.addMethodUrl, payload); 
}

deleteMethod(payload: any) {
  return this.http.post(this.deleteMethodUrl, payload);
}

}
