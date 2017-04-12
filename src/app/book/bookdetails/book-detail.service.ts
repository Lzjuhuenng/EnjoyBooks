import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from '../model/book-model';

@Injectable()
export class BookDetailService {
    public BookDetailURL = "src/mock-data/book-detail-mock.json";
    public BookDetail = "http://127.0.0.1:8080/getBookDetail"
    private AddBookToShelf = "http://127.0.0.1:8080/addBookToShelf";

    constructor(public http: Http) { 
    }
    //session 跨域丢失问题，解决方案 withCredentials:true
    public getBook(bookId:number):Observable<Book>{
        let url = this.BookDetail +"/"+bookId;
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ withCredentials:true});
        console.log(url,options);
        return 	this.http
        			.get(url,options)
                	.map((res: Response) => res.json());
    }
    //将电子书添加到书架
    public addToShelf(bookId:number):Observable<boolean>{
        let url = this.AddBookToShelf +"/"+bookId;
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ withCredentials:true});
        console.log(url,options);
        return 	this.http
        			.get(url,options)
                	.map((res: Response) => res.json());
    }
}