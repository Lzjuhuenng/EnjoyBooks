import { RouterModule } from '@angular/router';


import { BookShopComponent } from './book-shop/book-shop.component';

import { BookdetailComponent } from './bookdetails/book-detail.component';

import { BookshelvesComponent } from './bookshelves/bookshelves.component';
import { BookReadComponent } from './book-read/book-read.component';


export const BookRoutes=[
  {
		path:'',
		redirectTo:'bookshelves/1',
		pathMatch:'full'
	},{
		path:'bookshop/:page',
		component:BookShopComponent
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