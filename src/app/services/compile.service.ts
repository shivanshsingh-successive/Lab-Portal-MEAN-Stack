import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LanguageTable,languagesTable } from '../services/language';
@Injectable({
  providedIn: 'root'
})
export class CompileService {

  lang:LanguageTable;
  endpoint: string = 'http://localhost:3400';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    this.lang = languagesTable;
  }

  getOutput(id,code,input): Observable<any> {
    var coding = {
      script: code,
      stdin: input,
      language: this.lang[id-1][1][0].lang,
      versionIndex: this.lang[id-1][1][0].index
    };
    let api = `${this.endpoint}/code`;
    return this.http.post(api, coding).pipe(
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
}
