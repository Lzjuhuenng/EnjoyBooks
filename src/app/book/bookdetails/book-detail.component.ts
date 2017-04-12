import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Book } from './../model/book-model';
import { BookDetailService } from './book-detail.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookdetailComponent implements OnInit {
  
  public book : Book = new Book();
  private addToShelf : any = false;

  constructor(
    public bookDetailService: BookDetailService,
    public activeRoute: ActivatedRoute
  ) { 
     console.log(this.bookDetailService);
  }

  ngOnInit(){
      this.activeRoute.params.subscribe(
      params =>{
        this.getBook(params["bookId"]);
      });
  };

   public getBook(id:number){
    this.bookDetailService
        .getBook(id)
        .subscribe(
          data => {
            this.book = data
            if(this.book.accountId>0){
              this.addToShelf= true;
            }
        }
          ,
          error => console.error(error)
        ); 
  }

  public addBookToShelf(id:number){
    this.bookDetailService
        .addToShelf(id)
        .subscribe(
          data => {
            console.log(data);
            this.addToShelf = data;
            console.log(this.addToShelf+"this.addToShelf");
          },
          error => console.error(error)
        );
  }

}
