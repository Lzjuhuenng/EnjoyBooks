import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';

@Injectable()
export class BookShopService {
  public bookListURL = 'src/mock-data/booklist-mock.json';
  public bookListSearchURL = 'src/mock-data/postlist-search-mock.json';

  constructor(public http:Http) { }
  

  public getBookList(searchText: string,page:number=1):Observable<Book[]>{
    let url = this.bookListURL;
    let params = new URLSearchParams();
    if (searchText) {
			params.set('searchText',searchText);
      url = this.bookListSearchURL;
      console.log(`searchText=${searchText}`);
		}
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

  public getPostNumber():number{
    return 0;
  }

  public addPost(user:any){

  }

  public search() {
    
  }
}
