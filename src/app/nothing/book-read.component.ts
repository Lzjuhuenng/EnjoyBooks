import { Component ,HostListener ,OnInit ,Renderer ,ElementRef ,EventEmitter} from '@angular/core';
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
	
  public reader : any;
  public book : Book;
  private bookMarkArr : Array<Bookmark> = new Array<Bookmark>();
  // public bookmarkToggle = new EventEmitter<string>();
  private markThere : boolean;
  private globalClickCallbackFn: Function;
  private searchText : string ="";
  private isSearchState : boolean = false;
  private curEpubCfi : string;
  constructor( 
    public router: Router,
    public activeRoute: ActivatedRoute,
    public renderer: Renderer,
    public elementRef: ElementRef,
		//注入的服务要时全局单例的
    public bookReadService : BookReadService
	) { }

	ngOnInit() {
    //监听点击 更新书签图标状态
    	this.globalClickCallbackFn = this.renderer.listen(this.elementRef.nativeElement, 'click', (event: any) => {
			this.markThere = this.isBookmark();
      //console.log(this.markThere);
      console.log(this.reader);
      console.log("全局监听点击事件>" + event);
		});

  this.activeRoute.params.subscribe(
     params =>{
       this.onReady(params["bookId"]);
      }
    );
  	}

  public onReady(id:number){
    this.bookReadService
        .getBook(id)
        .subscribe(
          data => {
            this.book = data,console.log(this.book)
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
    
    this.reader = ePubReader(book.bookURL);

    console.log(this.reader);   
	}	

//  书签的图标的显示功能还未实现 （添加书签后更改样式）
   public bookmarkToggle(){
     let epubCfi = this.reader.book.getCurrentLocationCfi();
     let bookmark = new Bookmark();
     bookmark.epubcfi = epubCfi;
     bookmark.id = 1111+this.bookMarkArr.length;
     bookmark.title = this.getbookMarkTitle(epubCfi);
     let index = this.indexMarInBookmarkArr(bookmark);
     console.log(index);
     if(index>=0){
      let bookmark = this.bookMarkArr.splice(index)[0];
      this.reader.removeBookmark(bookmark);
      console.log(bookmark);
      console.log("removeBookMark")
     }else{
      this.reader.addBookmark(bookmark);
      this.bookMarkArr.push(bookmark);
      console.log("addBookMark")
     }

     console.log(this.bookMarkArr);
   
    }

    private indexMarInBookmarkArr(bookmark : Bookmark){
      for(let i=0;i<this.bookMarkArr.length;i++){
        if(bookmark.epubcfi.localeCompare(this.bookMarkArr[i].epubcfi)==0){
          return i;
        }
      }
      return -1;
    }

    private isBookmark():boolean{
      console.log("isBookmark")
      let epubCfi = this.reader.book.getCurrentLocationCfi();
      for(let i=0;i<this.bookMarkArr.length;i++){
        if(this.bookMarkArr[i].epubcfi==epubCfi){
          return true;
        }
      }
      return false;
    }
	



  private getbookMarkTitle(epubCli:string = ""):string{
    var node = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0];
    console.log(node);
    var uri = epubCli.slice(epubCli.indexOf('!')+1,epubCli.lastIndexOf('/'));
    var paths = uri.split('/');
    for(var i=0;i<paths.length;i++){
        var nodeArr = node.children;
        console.log(nodeArr);
        node = nodeArr[parseInt(paths[i])/2-1];
    }
    console.log(node);

    return node.innerHTML.slice(0,20);
  }


  private updateFonts(){
    var node = document.getElementsByTagName('iframe')[0].contentWindow.document.children[0];
    let body = node.children[1];
    console.log(body);
    let epubCfi = this.reader.book.getCurrentLocationCfi();
    // body.setAttribute("style","font-size:50px;");

    this.reader.settings.styles.fontSize="120%";
    console.log(this.reader.book.locations.percentageFromCfi(epubCfi));
    this.reader.book.displayChapter(epubCfi);


    //this.reader.trigger("renderer:keydown",this.reader.book);
    // console.log(EPUBJS.Layout.spreadWidth);

    // let pages = EPUBJS.Layout.ReflowableSpreads.calculatePages();
    // this.openBook(this.book);
    // EPUBJS.Renderer.updatePages(pages);
  }


  public searchContext(){
    this.clearSelection();//先清空一下上次高亮显示的内容；
    this.heightLight();
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

   
    
    //console.log("1111");        
  
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
      
      console.log(contents);

      let html = document.createElement('html');	
      html.innerHTML = contents;

      html.children;

      console.log(html.children[1]);

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

  private search(node:any){
    if(node.textContent.indexOf(this.searchText.trim())){
      let nodes = node.children;
      for(let i=0;i<nodes.length;i++){
        this.search(nodes[i]);
      }
    }
  }
  private analysisHTML(url:string=null){

    //let html = this.bookReadService.getHtml(url);
    let uri = this.reader.book.locations.spine[3].url;
    let html;
    //, this.store, this.credentials
    let chapter = new EPUBJS.Chapter(this.reader.book.locations.spine[3],this.reader.book.store)
    chapter.render(); 
    console.dir(chapter);
    this.bookReadService.getHtml(uri).subscribe(
      data => html = data
    );
    console.log(uri);
    //this.reader.book.contents.spine[3].href;
    console.log(html);
  }   
}

