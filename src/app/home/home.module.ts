import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HomeComponent }   from './home.component';
import { SocialChannelComponent } from './social-channel/social-channel.component';
import { OnlineContactComponent } from './online-contact/online-contact.component';

import {homeRoutes} from './home.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(homeRoutes)
    ],
    exports: [],
    declarations: [
        HomeComponent,
        SocialChannelComponent,
        OnlineContactComponent
    ],
    providers: [],
})
export class HomeModule { }
