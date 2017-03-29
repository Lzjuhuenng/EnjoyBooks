import { RouterModule } from '@angular/router';


import { BookListComponent } from './bookshop/book-list/book-list.component';

import { BookdetailComponent } from './bookdetails/book-detail.component';
import { BookshopComponent } from './bookshop/bookshop.component';
import { BookshelvesComponent } from './bookshelves/bookshelves.component';
import { BookReadComponent } from './book-read/book-read.component';


export const BookRoutes=[
  {
		path:'',
		redirectTo:'bookshelves/1',
		pathMatch:'full'
	},{
		path:'bookshop/:page',
		component:BookListComponent
	},
	{
		path:'bookread/:bookId',
		component:BookReadComponent
	},
	{ 
		path: 'bookdetail/:bookId', 
		component: BookdetailComponent 
	}
];