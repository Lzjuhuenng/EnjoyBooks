import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Book } from './../model/book-model';
import { Bookmark } from './../model/bookmark-model';


import { BookReadService } from '../book-read/book-read.service';

declare var EPUBJS : any ,ePubReader:any;

@Component({
  selector: 'app-book-read',
  templateUrl: './book-read.component.html',
  styleUrls: ['./book-read.component.scss']
})
export class BookReadComponent implements OnInit {
	
  public reader :any;
  public book : Book;
  private globalClickCallbackFn: Function;
  private bookMarkArr = new Array<Bookmark>();
  private existBookmark :boolean = false;
  constructor(
    private locations : Location,
    public elementRef: ElementRef,
    public renderer: Renderer,
    public router: Router,
    public activeRoute: ActivatedRoute,
		//注入的服务要时全局单例的
    public bookReadService : BookReadService
	) { }

	ngOnInit() {
    	this.globalClickCallbackFn = this.renderer.listen(this.elementRef.nativeElement, 'click', (event: any) => {
        this.existBookmark = this.hasBookmark();
			console.log("全局监听点击事件>" + event);
		});


  this.activeRoute.params.subscribe(
     params =>{
       this.onReady(params["bookId"]);
      }
    );
  	}

    ngOnDestroy(){
   
      this.bookReadService.recordLastRead(this.book.shelfId,this.reader.book.getCurrentLocationCfi())
      .subscribe(
          data => console.log(data)
      )
        
      console.log("ngOnDestroy");
    }

    // ngAfterViewChecked(){
    //   console.log("ngAfterViewChecked")
    //   this.bookReadService.recordLastRead(this.book.shelfId,this.reader.book.getCurrentLocationCfi());
    // }

  public onReady(id:number){
    this.bookReadService
        .getBook(id)
        .subscribe(
          data => {
            this.book = data,
            console.log(this.book)
            this.openBook(this.book);
        },
          error => console.error(error)
        );
        
  }

	public openBook (book : Book){
	
  	EPUBJS.filePath = "js/libs/";
    EPUBJS.cssPath = window.location.href.replace(window.location.hash, '').replace('index.html', '') + "css/";
    // fileStorage.filePath = EPUBJS.filePath;
		console.log(EPUBJS);
    this.reader = ePubReader(book.bookPath);
     console.log(this.reader); 
    if(book.lastRead!=null&&book.lastRead!=""){
      console.log(this.reader);
      this.reader.book.gotoCfi(book.lastRead);
      this.bookMarkArr = book.bookmarkList;
      this.createBookmarks();
    
      }         
	}	


  private bookmarkToggle(){
    let epubcfi = this.reader.book.getCurrentLocationCfi();
    let index = this.indexMarkInBookmarkArr(epubcfi);
    console.log(index);
    if(index>=0){
      let bookmark = this.bookMarkArr.splice(index)[0];
      this.bookReadService.delBookmark(bookmark.id).subscribe(
        data =>{
          this.reader.removeBookmark(bookmark);
          console.log(data);
          this.existBookmark = this.hasBookmark();
        }
      )
      
    }else{
      let bookmark = new Bookmark();
      bookmark.epubcfi = epubcfi;
      bookmark.title = this.getBookmarkTitle(epubcfi);
      bookmark.shelfId = this.book.shelfId;
      this.bookReadService.addBookmark(bookmark).subscribe(
         data => { 
          console.log(data);
          bookmark.id = Number(data);
          this.reader.addBookmark(bookmark);
          this.bookMarkArr.push(bookmark);
          console.log(this.bookMarkArr);
          this.existBookmark = this.hasBookmark();
          }
      );
    }

  }

  private indexMarkInBookmarkArr(epubcfi:string):any{
    for(let i=0;i<this.bookMarkArr.length;i++){
      if(epubcfi==this.bookMarkArr[i].epubcfi){
        return i;
      }
    }
    return -1;
  }

  private hasBookmark():boolean{
    console.log("hasBookmark");
    let epubcfi = this.reader.book.getCurrentLocationCfi();
    console.log(epubcfi);
    for(let i=0;i<this.bookMarkArr.length;i++){
      if(epubcfi == this.bookMarkArr[i].epubcfi){
        console.log("true");
        return true;
      }
    }
    return false;
  }
  private getBookmarkTitle(epubcfi:string):string{
    var node = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0];
    var uri = epubcfi.slice(epubcfi.indexOf('!')+1,epubcfi.lastIndexOf('/'));
    var paths = uri.split('/');
    for(let i=0;i<paths.length;i++){
      let nodeArr = node.children;
      node = nodeArr[parseInt(paths[i])/2-1];
    }

    return node.innerHTML.slice(0,20);
  }

  private createBookmarks(){
    for(let i=0;i<this.bookMarkArr.length;i++){
       this.reader.addBookmark(this.bookMarkArr[i])
    }
    this.hasBookmark();
  }

  private goBack():void{
    this.locations.back();
    this.locations.back();
  }
	
}