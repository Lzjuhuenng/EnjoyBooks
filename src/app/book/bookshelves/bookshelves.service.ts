import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';

@Injectable()
export class BookshelvesService {
  public bookListURL = 'src/mock-data/booklist-mock.json';
  private shelfBookURL = 'http://127.0.0.1:8080/getShelfBooks';

  constructor(public http:Http) { }
  

  public getBookList(page:number=1):Observable<Book[]>{
    let url = this.shelfBookURL+'/'+page;
    let headers = new Headers({'Content-Type' : 'application/json' });
    let options = new RequestOptions({headers:headers,withCredentials:true});
    return this.http
               .get(url,options)
               .map((res:Response) => {
                   let result=res.json();
                   console.log(result);
                   return result;
               })
               .catch((error:any) => Observable.throw(error || 'Server error'));
  }
}
