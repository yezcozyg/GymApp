import { Injectable } from '@angular/core';
import { Customer } from './customer';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticateService } from './authenticate.service';
import { map, catchError, tap } from 'rxjs/operators';
// import 'rxjs/add/operator/map';import { catchError, map, tap } from 'rxjs/operators';
// import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = 'http://localhost:4200/customers';
  registerUrl = '/register';

    customers: Customer[];

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

  constructor(private http: HttpClient, private authenticate: AuthenticateService,
    private messageService: MessageService) { }



  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url, this.authenticate.getAuthorizationOptions());
  }

  postCustomers(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.registerUrl, customer, this.httpOptions);
  }

  deleteCustomer (id: string): Observable<{}> {
    const url = `${this.url}/${id}`; // DELETE api/heroes/42
    console.log(url);
    return this.http.delete(url, this.httpOptions);  
      // .pipe(
      //   catchError(this.handleError('deleteHero'))
      // );
  }
  
  getCustomer(id: string): Observable<Customer> {
    const url = `${this.url}/${id}`;
    console.log("getting: "+url);
    return this.http.get<Customer>(url).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<Customer>(`getCustomer id=${id}`))
    );
  }

  updateCustomer(customer: Customer, id: string): Observable<Customer> {
    const url = `${this.url}/${id}`;
    console.log("======"+url);
    return this.http.put(url, customer, this.httpOptions).pipe(
      tap(_ => this.log(`updated Customer`)),
      catchError(this.handleError<any>('updateCustomer'))
    );
  }


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
    this.messageService.add(`HeroService: ${message}`);
  }
}
