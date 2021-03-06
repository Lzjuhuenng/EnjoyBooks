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

    private updateFonts(size:number){
      var node = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0];
      let body = node.children[1];
      console.log(body);
      let epubCfi = this.reader.book.getCurrentLocationCfi();
      // body.setAttribute("style","font-size:50px;");

      this.reader.settings.styles.fontSize=size+"%";
      //this.reader.settings.styles.backgroundColor="red";
      $('#main').addClass("redBack");
      console.log(this.reader.book.locations.percentageFromCfi(epubCfi));
      this.reader.book.displayChapter(epubCfi);


      //this.reader.trigger("renderer:keydown",this.reader.book);
      // console.log(EPUBJS.Layout.spreadWidth);

      // let pages = EPUBJS.Layout.ReflowableSpreads.calculatePages();
      // this.openBook(this.book);
      // EPUBJS.Renderer.updatePages(pages);
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



  //全文检索部分
  public searchContext(){
    this.clearSelection();//先清空一下上次高亮显示的内容；
    this.heightLight();

    //console.log(this.reader);
    
    var hi = this.heightLight;
    var searchText = $('#searchBox').val();
    // console.dir($("#view"));

    this.reader.book.renderer.on('renderer:chapterDisplayed',function(msg){
      hi();
    alert("renderer:chapterDisplayed");
    }
    ,false);
    //document.addEventListener('DOMAttrModified',function(){alert(1)},false);
    //document.addEventListener('DOMNodeRemoved',function(){alert(1)},false);
    
    //this.analysisHTML();
    
    //console.log(searchText);
    // var _searchTop = $('#searchBox').offset().top+30;
    //如果输入值为空 跳出方法
    if($.trim(searchText)=="" || $.trim(searchText)=='.'){
      return;
    }
    var regExp = new RegExp(searchText, 'g');//创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；
    //this.reader.book.locations.spine[3]
    let spines = this.reader.book.locations.spine;
    var addSearchResult = this.addSearchResult;
    // console.dir(spines);
    let store = this.reader.book.store;
    var result = new Array();
    var reader = this.reader;
    var heightLight = this.heightLight;
    for(let spine of spines){
      //debugger;
      let chapter = new EPUBJS.Chapter(spine,store);

      chapter.render().then(function(contents) {
      
      //console.log(contents);

      let html = document.createElement('html');	
      html.innerHTML = contents;

      html.children;

      //console.log(html.children[1]);

      let body = html.children[1];

      let content = $(body).text();

       if (!regExp.test(content)) {
        //不存在要检索的项
        return;
      }
      let titleArr ; 
      //var regExp2 = new RegExp('.{0,5}'+searchText+'.{0,5}','g');
      // var regExp2 = new RegExp('.{0,5}'+searchText+'.{0,5}','g');
      let regExp2 = new RegExp(searchText,'g');
      let titleResult = new Array() ;
      let elemResult = new Array();
    
      $(body.children).each(function(){
        let html = $(this).html();
        console.log("++++++++++++++++++++++=");
        titleArr = regExp2.exec(html);
        let index = 0;
        //console.log("------------------------------------");
        //console.log(html.match(regExp2));

        while(titleArr){
          titleResult.push(titleArr[0].trim());
          //lastIndex 是可以进行读写操作的，会为下一次检索提供初始位置
          regExp2.lastIndex = titleArr.index + titleArr[0].indexOf(searchText) +searchText.length-1; 
          titleArr = regExp2.exec(html);
          //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
          //console.log(titleArr);
        }
           
        let newHtml = html.replace(regExp, '<span class="highlight" style="background: yellow; color: red;">'+searchText+'</span>');//将找到的关键字替换，加上highlight属性；
      
        $(this).html(newHtml);//更新；
        //console.log($(this));
        let spanArr =$(this).find(".highlight");
        if(spanArr){
          for(let i=0;i<spanArr.length;i++){
            elemResult.push(spanArr[i]);
          }
          //console.log(spanArr)
        }
      });

      for(let i =0;i< titleResult.length;i++){

         let base = chapter.cfiBase;
        // let path = this.reader.book.currentChapter.epubcfi.pathTo(elem);
         let epubcfi = chapter.epubcfi.generateCfiFromElement(elemResult[i],base);
        //console.log(epubcfi+"=================");

        result.push({
          epubcfi:epubcfi,
          title:titleResult[i],
          heightLight:heightLight
        })


        //this.addSearchResult(elemResult[i],titleResult[i],chapter);
      }
       console.log(result);
       addSearchResult(result,reader);
       result = new Array();
      });
    }

 
    
  
  }


  public addSearchResult(result: any,reader:any){
    console.log(result[0]);
    // let base = chapter.cfiBase;
    // let path = this.reader.book.currentChapter.epubcfi.pathTo(elem);
    // let epubcfi = chapter.epubcfi.generateCfiFromElement(elem,base);
    //console.log(epubcfi+"=================");
    for(let i=0;i<result.length;i++){
        reader.addSearch({
        epubcfi:result[i].epubcfi,
        title:result[i].title
        })
    }
  }


  private heightLight(){
    var searchText = $('#searchBox').val();
    if($.trim(searchText)=="" || $.trim(searchText)=='.'){
      return;
    }
    var regExp = new RegExp(searchText, 'g');
    let body = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0].children[1];
    var content = $(body).text();
    if (!regExp.test(content)) {
      //不存在要检索的项
      return;
    }
    $(body.children).each(function(){
      var html = $(this).html();
    
      var newHtml = html.replace(regExp, '<span class="highlight" style="background: yellow; color: red;">'+searchText+'</span>');//将找到的关键字替换，加上highlight属性；
      
      $(this).html(newHtml);//更新；
    });
  }


  private clearSelection(){
     let body = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0].children[1];
        $(body.children).each(function(){
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function(){
                $(this).replaceWith($(this).html());//将他们的属性去掉；
            });
        });
        this.reader.removeSearch();
    }
}









//单章检索
/*  
    let body = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0].children[1];
    var content = $(body).text();
    //console.log(content);
    
  
    if (!regExp.test(content)) {
      //不存在要检索的项
      return;
    }
        
    var titleArr ; 
    //var regExp2 = new RegExp('.{0,5}'+searchText+'.{0,5}','g');
    // var regExp2 = new RegExp('.{0,5}'+searchText+'.{0,5}','g');
    var regExp2 = new RegExp(searchText,'g');
    var titleResult = new Array() ;
    var elemResult = new Array();
    $(body.children).each(function(){
      var html = $(this).html();
      console.log(html);
      titleArr = regExp2.exec(html);
      let index = 0;
      console.log("------------------------------------");
      console.log(html.match(regExp2));

      while(titleArr){
        titleResult.push(titleArr[0].trim());
        //lastIndex 是可以进行读写操作的，会为下一次检索提供初始位置
        regExp2.lastIndex = titleArr.index + titleArr[0].indexOf(searchText) +searchText.length-1; 
        titleArr = regExp2.exec(html);
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(titleArr);
      }
           
      var newHtml = html.replace(regExp, '<span class="highlight" style="background: yellow; color: red;">'+searchText+'</span>');//将找到的关键字替换，加上highlight属性；
      
      $(this).html(newHtml);//更新；
      console.log($(this));
      let spanArr =$(this).find(".highlight");
       if(spanArr){
        for(let i=0;i<spanArr.length;i++){
          elemResult.push(spanArr[i]);
        }
        console.log(spanArr)
      }
    });
        
    console.log(elemResult);
    console.log(titleResult);
    for(let i =0;i< titleResult.length;i++){
        this.addSearchResult(elemResult[i],titleResult[i],"");
    }
    */