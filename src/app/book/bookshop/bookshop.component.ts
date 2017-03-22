import { Component, OnInit } from '@angular/core';
import { flyIn } from '../../animations/fly-in';

@Component({
  selector: 'app-bookshop',
  templateUrl: './bookshop.component.html',
  styleUrls: ['./bookshop.component.scss'],
  animations: [flyIn]
})
export class BookshopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
