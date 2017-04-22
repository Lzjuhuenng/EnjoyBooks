import {RouterModule} from "@angular/router";
import { UserMainComponent } from './user-main/user-main.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CommentTableComponent } from '../manage/comment-table/comment-table.component';

export const userRoutes = [
  	{
		path:'',
		component:UserMainComponent,
	    children: [
	    	{ path: '', redirectTo:'posttable/page/1',pathMatch:'full'},
	    	{ path: 'commenttable/page/:page', component: CommentTableComponent },
	    	{ path: 'profile', component: UserProfileComponent },
			{ path:'**', redirectTo:'write' }
	    ]
	}
];