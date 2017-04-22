import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PostSharedModule } from '../shared/post.module';

import { AlertModule, AccordionModule } from 'ng2-bootstrap';

import { UserMainComponent } from './user-main/user-main.component';


import { userRoutes } from './user.routes';

@NgModule({
  declarations: [
    UserMainComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertModule,
    AccordionModule,
    SharedModule,
    PostSharedModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    UserMainComponent
  ],
  providers: [
  ]
})
export class UserModule { }