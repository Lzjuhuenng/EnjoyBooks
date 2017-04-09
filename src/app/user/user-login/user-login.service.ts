import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Http, Headers, Response ,RequestOptions } from '@angular/http';
import { User } from '../model/user-model';
import {Account } from '../model/account-model';
@Injectable()
export class UserLoginService {

  public userLoginURL = 'src/mock-data/user-login-mock.json';
  public userLogin = 'http://127.0.0.1:8080/access/login';
  public subject: Subject<Account> = new Subject<Account>();
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http:Http,public router: Router){}

  public get currentAccount():Observable<Account>{
      return this.subject.asObservable();
  }

  public login(account:Account):any{
    let headers = new Headers({ 'Content-Type' : 'application/json' });

    let options = new RequestOptions({ headers: headers });

    return this.http
           .post(this.userLogin, account , options)
            //.get(this.userLogin)
            .map((response: Response) => {
              let user = response.json();
              console.log("account object>"+account);
              if(user && user.token){
              
              }
              return response;
            })
            .subscribe(
                data => {

                    let msg = data.json();
                    
                    console.log(msg);
                    if(msg.success){
                      console.log("success");
                      localStorage.setItem("currentAccount",JSON.stringify(account));
                      this.subject.next(Object.assign({},account));
                      this.router.navigate(['/bookshelves/1'])
                      }
                },
                error => {
                    console.error(error);
                }
            );
  }

  public logout():void{
    localStorage.removeItem("currentAccount");
    this.subject.next(Object.assign({}));
  }
}
