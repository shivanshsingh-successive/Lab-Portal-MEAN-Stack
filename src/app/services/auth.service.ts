import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from './user';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router,NavigationEnd } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

endpoint: string = 'http://localhost:3400/api';
end: string = 'http://localhost:3400';
headers = new HttpHeaders().set('Content-Type', 'application/json');
currentUser = {};
private previousUrl: string;
private currentUrl: string;

constructor(private router:Router,private http: HttpClient) { 
  this.currentUrl = this.router.url;
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {        
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    };
  });
}

public getPreviousUrl() {
  return this.previousUrl;
}    

public getCurrentUrl(){
  return this.currentUrl;
}

addsubject(code: string,labno: number,question: string){
  var body = { code: code, labno: labno, question: question };
  let api = `${this.endpoint}/add-question`;
  return this.http.post(api, body, { headers: this.headers }).pipe(
    map((res: Response) => {
      return res || {} 
    }),
    catchError(this.handleError)
  )
}

// Sign-up
signUp(user: User): Observable<any> {
let api = `${this.endpoint}/register-user`;
return this.http.post(api, user)
  .pipe(
    catchError(this.handleError)
  )
}

// Sign-in
signIn(user: User) {
  return this.http.post<any>(`${this.endpoint}/signin`, user)
    .subscribe((res: any) => {
      localStorage.setItem('access_token', res.token)
      this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        this.router.navigate(['user-profile/' + res.msg._id]);
      })
    })
}

getToken() {
  return localStorage.getItem('access_token');
}

get isLoggedIn(): boolean {
  let authToken = localStorage.getItem('access_token');
  return (authToken !== null) ? true : false;
}

doLogout() {
  let removeToken = localStorage.removeItem('access_token');
  if (removeToken == null) {
    this.router.navigate(['/']);
  }
}

getName() {
  let name = 'No User';  
  let token = localStorage.getItem('access_token');
  let decoded = jwt_decode(token); 
  name = decoded.firstname;
  return name;
}

getUserName() {
  let name = '';  
  let token = localStorage.getItem('access_token');
  let decoded = jwt_decode(token); 
  name = decoded.username;
  return name;
}

// User profile
getUserProfile(id): Observable<any> {
  let api = `${this.endpoint}/user-profile/${id}`;
  return this.http.get(api, { headers: this.headers }).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.handleError)
  )
}

// Error
handleError(error: HttpErrorResponse) {
  let msg = '';
  if (error.error instanceof ErrorEvent) {
    // client-side error
    msg = error.error.message;
  } else {
    // server-side error
    msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  return throwError(msg);
}

// Subject Info
getsubject(){
  return this.http.get<any>(`${this.endpoint}/get-subjects`)
}

// Subject Detail
getSubjectDetails(id): Observable<any> {
  let api = `${this.endpoint}/subject/${id}`;
  return this.http.get(api, { headers: this.headers }).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.handleError)
  )
}

// Subject Detail
getLabDetails(code,labno): Observable<any> {
  let api = `${this.endpoint}/lab/${code}/${labno}`;
  return this.http.get(api, { headers: this.headers }).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.handleError)
  )
}


// Report of students
getResults(code,labno): Observable<any> {
  let api = `${this.endpoint}/data/${code}/${labno}`;
  return this.http.get(api, { headers: this.headers }).pipe(
    map((res: Response) => {
      return res || {} 
    }),
    catchError(this.handleError)
  )
}  

// Download User File
downloadFile(file:String){
  var body = {filename:file};
  return this.http.post(`${this.end}/download`,body,{
      responseType : 'blob',
      headers : this.headers
  });
}

//Download Lab Code
downloadCode(labitem: Object){
  console.log(labitem);
  let api = `${this.end}/code-download`;
  return this.http.post(api, labitem, { 
    responseType : 'blob',
    headers: this.headers 
  });
}
}
