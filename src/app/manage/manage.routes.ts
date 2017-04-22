import { ManageMainComponent } from './manage-main/manage-main.component';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';
import { AuthGuard } from './auth-guard';

export const manageRoutes = [
  	{
		path:'',
		component:ManageMainComponent,
		canActivate: [AuthGuard],
	    children: [
	    	{ path: '',redirectTo:'posttable/page/1',pathMatch:'full'},
	    	{ path: 'usertable/edituser/:userId', component: UserProfileComponent },
	    	{ path: 'usertable/newuser', component: UserProfileComponent },
	    	{ path: '**', redirectTo:'posttable/page/1' }
	    ]
	}
];