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
  // {
  //   path: 'calendar',
  //   loadChildren: () =>
  //     import('./components/calendar/calendar.module').then(
  //       (m) => m.CalendarModule
  //     ),
  // },
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
