import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Account } from '../model/account-model';


@Injectable()
export class UserRegisterService {
    public userRegisterURL = "src/mock-data/user-register-mock.json";
    public testEmailURL = "http://127.0.0.1:8080/isEmailExist";
    private testAccountURL = "http://127.0.0.1:8080/isAccountExist";
    private registerURL = "http://127.0.0.1:8080/isAccountExist";

    public subject: Subject<Account> = new Subject<Account>();

    constructor(public http:Http) {
    }

    public get currentAccount():Observable<Account>{
        return this.subject.asObservable();
    }

    public register(account: Account){
        console.log(account);
        
        //向后台post数据的写法如下
        // let data = new URLSearchParams();
        // data.append('email', user.email);
        // data.append('password', user.password);
        // return this.http.post(this.userRegisterURL,data);
        
        return this.http
                    .get(this.userRegisterURL)
                    .map((response: Response) => {
                        let user = response.json();
                        localStorage.setItem("currentUser",JSON.stringify(user));
                        this.subject.next(user);    
                    });
    }

    public testEmail(email:string){
        
        let url = this.testEmailURL +'/'+email;

        return this.http.get(this.testEmailURL)
            .map((response: Response) => response.json());
    }

    public testAccount(account:string){

        let url = this.testAccountURL +'/'+account;

        return this.http.get(this.testEmailURL)
            .map((response: Response) => response.json());
    }
}