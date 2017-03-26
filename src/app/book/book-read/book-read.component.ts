import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Book } from './../model/book-model';

import { BookReadService } from '../book-read/book-read.service';

declare var EPUBJS : any ,ePubReader:any;

@Component({
  selector: 'app-book-read',
  templateUrl: './book-read.component.html',
  styleUrls: ['./book-read.component.scss']
})
export class BookReadComponent implements OnInit {
	public reader :any;

  constructor( 
    public router: Router,
    public activeRoute: ActivatedRoute,
		//注入的服务要时全局单例的
    public bookReadService : BookReadService
	) { }

	ngOnInit() {
			this.onReady();	
  		
	
	
  	}

	public onReady (book = "assets/book/6490.epub"){
	
  	EPUBJS.filePath = "js/libs/";
    EPUBJS.cssPath = window.location.href.replace(window.location.hash, '').replace('index.html', '') + "css/";
    // fileStorage.filePath = EPUBJS.filePath;
		console.log(EPUBJS);
    this.reader = ePubReader(book);
           
	}	
	
}