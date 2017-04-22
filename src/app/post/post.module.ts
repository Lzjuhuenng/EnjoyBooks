import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ng2-bootstrap';

import { PostlistService } from './postlist/services/postlist.service';
import { AddCommentComponent } from '../comment/add-comment/add-comment.component';
import { CommentService } from '../comment/services/comment.service';
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
        AddCommentComponent,
        BooleanPipe
    ],
    providers: [
        PostlistService,
        CommentService
    ]
})
export class PostModule { }
