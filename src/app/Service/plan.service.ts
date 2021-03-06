import { Injectable } from '@angular/core';
import { Plan } from '../Model/Plan';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticateService } from './authenticate.service';
import { map, catchError, tap } from 'rxjs/operators';
import { URLSearchParams } from '@angular/http';
import {  HttpParams } from '@angular/common/http';






@Injectable({ providedIn: 'root' })
export class PlanService {
      url = '/api/plans';
     // httpOptions = this.authenticate.getAuthorizationOptions();
      plans: Plan[];
  
  
    constructor(private http: HttpClient, private authenticate: AuthenticateService,
      private messageService: MessageService) { }

  
    getPlans(): Observable<Plan[]> {
        // let params = new HttpParams().set('plan', plan);
        console.log("url in js: " + this.url);
        return this.http.get<Plan[]>(this.url);
    }

    deletePlan (id: string): Observable<{}> {
      const url = `${this.url}/${id}`; // DELETE api/heroes/42
      console.log(url);
      return this.http.delete(url, { headers: this.authenticate.getAuthorizationOptions() });  
        // .pipe(
        //   catchError(this.handleError('deleteHero'))
        // );
    }

    updatePlan(plan: Plan, id: string): Observable<Plan> {
      const url = `${this.url}/${id}`;
      console.log("======"+url);
      return this.http.put(url, plan, { headers : this.authenticate.getAuthorizationOptions() }).pipe(
        tap(_ => this.log(`updated Customer`)),
        catchError(this.handleError<any>('updateCustomer'))
      );
    }

    getPlan(id: string): Observable<Plan> {
      const url = `${this.url}/${id}`;
      console.log("getting: "+url);

      return this.http.get<Plan>(url, { headers: this.authenticate.getAuthorizationOptions() });
      // .pipe(
      //   tap(_ => this.log(`fetched plan id=${id}`)),
      //   catchError(this.handleError<Plan>(`getPlan id=${id}`))
      // );
    }

    postPlan(plan: Plan): Observable<Plan> {
      return this.http.post<Plan>(this.url, plan, { headers: this.authenticate.getAuthorizationOptions() });
    }

    // postIcon(selectedFile): Observable<T>{
    //   this.http.post('my-backend.com/file-upload', selectedFile)
    //   .subscribe();
    // }

    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
  
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      this.messageService.add(`planService: ${message}`);
    }
  
}