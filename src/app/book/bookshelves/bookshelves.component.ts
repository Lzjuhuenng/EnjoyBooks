import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Book } from './../model/book-model';

import { BookshelvesService } from './bookshelves.service';


import { flyIn } from '../../animations/fly-in';



@Component({
  selector: 'app-bookshelves',
  templateUrl: './bookshelves.component.html',
  styleUrls: ['./bookshelves.component.scss'],
  animations: [flyIn]
})
export class BookshelvesComponent implements OnInit {


  	public itemsPerPage:number=24;
	public totalItems:number;
	//不要手动对这个属性进行赋值，它是和分页工具条自动绑定的
	public currentPage:number = 1;

	public searchText:string;
	public searchTextStream:Subject<string> = new Subject<string>();

	public bookList:Array<Book>;


  constructor(
     public router: Router,
    public activeRoute: ActivatedRoute,
		//注入的服务要时全局单例的
    public bookshelvesService:BookshelvesService
  ) { }

  ngOnInit() {
   		this.activeRoute.params.subscribe(params => {
  			// 这里可以从路由里面获取URL参数
  			console.log(params);
			this.loadData(this.searchText,this.currentPage);
   		});
		
		this.searchTextStream
	        .debounceTime(500)
	        .distinctUntilChanged()
	        .subscribe(searchText => {
				console.log(this.searchText);
	        	this.loadData(this.searchText,this.currentPage)
	        });
  	}

  	public loadData(searchText:string,page:number){
		let offset = (this.currentPage-1)*this.itemsPerPage;
		let end = (this.currentPage)*this.itemsPerPage;
		
		return this.bookshelvesService.getBookList(page).subscribe(
			res=>{
				this.totalItems = res["totalRecords"];
				//TODO.正式环境中，需要去掉slice
				this.bookList = res["list"];
			},
			error => {console.log(error)},
			() => {}
		);
	}
	 
	public pageChanged(event:any):void {
		this.router.navigateByUrl("bookshelves/"+event.page);
	}
}