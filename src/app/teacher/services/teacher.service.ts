import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Teacher } from './teacher';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  endpoint: string = 'http://localhost:3400/api/teacher';
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

 // Sign-up
 signUp(teacher: Teacher): Observable<any> {
  let api = `${this.endpoint}/register-user`;
  return this.http.post(api, teacher)
    .pipe(
      catchError(this.handleError)
    )
}

// Sign-in
signIn(teacher: Teacher) {
  return this.http.post<any>(`${this.endpoint}/sign-in`, teacher)
    .subscribe((res: any) => {
      localStorage.setItem('access_token', res.token)
      this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        this.router.navigate(['profile/' + res.msg._id]);
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

// User profile
getUserProfile(id): Observable<any> {
  let api = `${this.endpoint}/profile/${id}`;
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
getsubject(code){
  return this.http.post<any>(`${this.endpoint}/get-subjects`,{code})
}


}
