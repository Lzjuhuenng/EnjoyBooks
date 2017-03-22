import { Component, OnInit } from '@angular/core';
import { flyIn } from '../../animations/fly-in';

@Component({
  selector: 'app-bookshelves',
  templateUrl: './bookshelves.component.html',
  styleUrls: ['./bookshelves.component.scss'],
  animations: [flyIn]
})
export class BookshelvesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
