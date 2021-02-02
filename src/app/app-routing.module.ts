import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { ALL_ROUTES } from './core/routes/all-routes';

const routes: Routes = [
  {
    path: "",
    component: DashboardLayoutComponent,
    children: ALL_ROUTES
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }