import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ng2-bootstrap';

import { BooleanPipe } from '../utils/boolean-pipe';

import {postRoutes} from './post.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        PaginationModule.forRoot(),
        RouterModule.forChild(postRoutes)
    ],
    exports: [BooleanPipe],
    declarations: [
        BooleanPipe
    ],
    providers: [
    ]
})
export class PostModule { }
