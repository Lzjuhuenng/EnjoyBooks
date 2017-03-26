import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';

@Injectable()
export class BookshelvesService {
  public bookListURL = 'src/mock-data/booklist-mock.json';

  constructor(public http:Http) { }
  

  public getBookList(searchText: string,page:number=1):Observable<Book[]>{
    let url = this.bookListURL;
    let params = new URLSearchParams();
  
    params.set('page',String(page));
    
    return this.http
               .get(url,{search:params})
               .map((res:Response) => {
                   let result=res.json();
                   console.log(result);
                   return result;
               })
               .catch((error:any) => Observable.throw(error || 'Server error'));
  }
}
