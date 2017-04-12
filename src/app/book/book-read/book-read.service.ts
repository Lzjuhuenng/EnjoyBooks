import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';

@Injectable()
export class BookReadService {
  public BookDetailURL = "src/mock-data/book-detail-mock.json";
  private bookReadURL = "http://127.0.0.1:8080/getReadBook";


  constructor(public http:Http) { }
  
   public getBook(id:number):Observable<Book>{
      let url = this.bookReadURL+"/"+id;
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ withCredentials:true});
        return 	this.http
        			.get(url,options)
                	.map((res: Response) => res.json());
    }
}
