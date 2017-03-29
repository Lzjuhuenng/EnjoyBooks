import { Component, OnInit } from '@angular/core';
import { flyIn } from '../../../animations/fly-in';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  animations: [flyIn]
})
export class BookSearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
