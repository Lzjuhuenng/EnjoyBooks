import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Book } from './../model/book-model';
import { BookType } from './../model/booktype-model';

@Injectable()
export class BookShopService {
  public bookListURL = 'src/mock-data/booklist-mock.json';
  public bookListSearchURL = 'src/mock-data/postlist-search-mock.json';
  public bookBookList = 'http://127.0.0.1:8080/getBooks';
  
  private bookTypesURL = 'http://127.0.0.1:8080/getBookTypes';

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
               //.get(url,{search:params})
               .get(this.bookBookList,{search:params})
               .map((res:Response) => {
                   let result=res.json();
                   console.log(result);
                   return result;
               })
               .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public getBooks(typeId:number = -1,page:number=1,searchText:string = "null"):Observable<Book[]>{
    searchText =searchText.trim()==""?"null":searchText.trim();
    let url = this.bookBookList+"/"+typeId +"/"+page +"/"+searchText;
    let headers = new Headers({ 'Content-Type' : 'application/json' });
    let options = new RequestOptions({ withCredentials:true});

    return this.http
               //.get(url,{search:params})
               .get(url,options)
               .map((res:Response) => {
                   let result=res.json();
                   console.log(result);
                   return result;
               })
               .catch((error:any) => Observable.throw(error || 'Server error'));
  }

    public getBookTypes():Observable<BookType[]>{
    

    return this.http
               //.get(url,{search:params})
               .get(this.bookTypesURL)
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
