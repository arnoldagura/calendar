import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/time',
    pathMatch: 'full',
  },
  {
    path: 'time',
    loadChildren: () => import('./time/time.module').then((m) => m.TimeModule),
  },
  {
    path: '**',
    redirectTo: '/time',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
