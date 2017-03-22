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

  constructor(
    public bookDetailService: BookDetailService,
    public activeRoute: ActivatedRoute
  ) { 
     console.log(this.bookDetailService);
  }

  ngOnInit(){
      this.activeRoute.params.subscribe(
      params =>this.getBook(params["bookId"])
    );
  };

   public getBook(id:number){
    this.bookDetailService
        .getPost(id)
        .subscribe(
          data => this.book = data,
          error => console.error(error)
        );
  }

}
