import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';

@Injectable()
export class BookReadService {
  public BookDetailURL = "src/mock-data/book-detail-mock.json";

  constructor(public http:Http) { }
  
   public getBook(id:number):Observable<Book>{
        return 	this.http
        			.get(this.BookDetailURL)
                	.map((res: Response) => res.json());
    }

 
}
