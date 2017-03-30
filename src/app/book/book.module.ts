import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ng2-bootstrap';

import { BookShopComponent } from './book-shop/book-shop.component';
import { BookReadComponent } from './book-read/book-read.component';

import { BookshelvesComponent } from './bookshelves/bookshelves.component';
import { BookdetailComponent } from './bookdetails/book-detail.component';


import { RowStartPipe } from '../utils/isRowStart-pipe';
import { RowEndPipe } from '../utils/isRowEnd-pipe';

import { BookShopService } from './book-shop/book-shop.serveice';
import { BookDetailService } from './bookdetails/book-detail.service';
import { BookReadService } from './book-read/book-read.service';
import { BookshelvesService } from './bookshelves/bookshelves.service';

import { BookRoutes } from './book.routes';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        PaginationModule.forRoot(),
        RouterModule.forChild(BookRoutes)
    ],
    exports: [RowStartPipe,RowEndPipe],
    declarations: [
        BookShopComponent,
        BookReadComponent,
        BookshelvesComponent,
        BookdetailComponent,
        RowStartPipe,
        RowEndPipe
    ],
    providers: [
        BookShopService,
        BookDetailService,
        BookReadService,
        BookshelvesService
    ]
})
export class BookModule { }
