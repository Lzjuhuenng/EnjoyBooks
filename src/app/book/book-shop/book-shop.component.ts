import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Book } from './../model/book-model';
import { BookType } from './../model/booktype-model';

import { BookShopService } from './book-shop.serveice';


@Component({
  selector: 'app-book-shop',
  templateUrl: './book-shop.component.html',
  styleUrls: ['./book-shop.component.scss']
})
export class BookShopComponent implements OnInit {

	private typeId:number = -1;
  	
	public maxSize:number = 24;
	public itemsPerPage:number=24;
	public totalItems:number;
	//不要手动对这个属性进行赋值，它是和分页工具条自动绑定的
	public currentPage:number = 1;

	public searchText:string;
	public searchTextStream:Subject<string> = new Subject<string>();

	public bookList:Array<Book>;
	private bookTypes : Array<BookType>;

  constructor( 
    public router: Router,
    public activeRoute: ActivatedRoute,
		//注入的服务要时全局单例的
    public bookListService:BookShopService
	) { }

	ngOnInit() {
		this.loadBookTypes();
		console.log(this.bookTypes);
  		this.activeRoute.params.subscribe(params => {
  			// 这里可以从路由里面获取URL参数
  			console.log(params);
			this.loadData(this.typeId ,this.currentPage ,this.searchText);
   		});
		
		this.searchTextStream
	        .debounceTime(500)
	        .distinctUntilChanged()
	        .subscribe(searchText => {
				console.log(this.searchText);
	        	this.loadData(this.typeId ,this.currentPage ,this.searchText)
	        });
  	}

  	public loadData(typeId:number = -1 ,page:number =1 ,searchText:string ="null"){
		let offset = (this.currentPage-1)*this.itemsPerPage;
		let end = (this.currentPage)*this.itemsPerPage;
		
		return this.bookListService.getBooks(typeId,page,searchText).subscribe(
			res=>{
				console.log(res);
				this.totalItems = res["totalRecords"];
				console.log("totalItems"+this.totalItems);
				//TODO.正式环境中，需要去掉slice
				this.bookList = res["list"];
				console.log(this.bookList);
			},
			error => {console.log(error)},
			() => {}
		);
	}


		public loadBookTypes(){
		
		return this.bookListService.getBookTypes().subscribe(
			res=>{
				this.bookTypes = res;
			},
			error => {console.log(error)},
			() => {}
		);
	}
	 
	public pageChanged(event:any):void {
		this.router.navigateByUrl("bookshop/"+event.page);
	}

	public searchChanged($event):void{
		this.searchTextStream.next(this.searchText);
	}
	
	public gotoWrite():void{
		//TODO：如果没有登录，跳转到登录页，如果已登录，跳往写作页
		this.router.navigateByUrl("user/write");
	}

	private changeTypeId(typeId:number){
		console.log("changeTypeId" + typeId);
		this.typeId = typeId;
		this.loadData(this.typeId)
	}
}