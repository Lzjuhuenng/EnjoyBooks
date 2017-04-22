import {RouterModule} from "@angular/router";
import { UserMainComponent } from './user-main/user-main.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const userRoutes = [
  	{
		path:'',
		component:UserMainComponent,
	    children: [
	    	{ path: '', redirectTo:'posttable/page/1',pathMatch:'full'},
	    	{ path: 'profile', component: UserProfileComponent },
			{ path:'**', redirectTo:'write' }
	    ]
	}
];