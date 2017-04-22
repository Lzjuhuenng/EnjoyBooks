import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AccordionModule } from 'ng2-bootstrap';

import { SharedModule} from '../shared/shared.module';
import { ManageMainComponent } from './manage-main/manage-main.component';


import { AuthGuard } from './auth-guard';

import { manageRoutes } from './manage.routes';

@NgModule({
  declarations: [
    ManageMainComponent
  ],
  imports: [
	  CommonModule,
    AccordionModule,
    SharedModule,
    RouterModule.forChild(manageRoutes)
  ],
  exports:[
  	ManageMainComponent
  ],
  providers: [
    AuthGuard
  ]
})
export class ManageModule { }