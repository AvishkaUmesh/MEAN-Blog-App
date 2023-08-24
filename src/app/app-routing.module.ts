import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthGuard } from './auth/auth.guard';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [isAuthGuard],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [isAuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
