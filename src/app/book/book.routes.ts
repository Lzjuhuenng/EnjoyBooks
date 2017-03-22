import { RouterModule } from '@angular/router';


import { BookListComponent } from './book-list/book-list.component';

import { BookdetailComponent } from './bookdetails/book-detail.component';
import { BookshopComponent } from './bookshop/bookshop.component';

export const BookRoutes=[
  {
		path:'',
		redirectTo:'page/1',
		pathMatch:'full'
	},
	{
		path:'page/:page',
		component:BookListComponent
	},
	{ 
		path: 'bookdetail/:bookId', 
		component: BookdetailComponent 
	}
];