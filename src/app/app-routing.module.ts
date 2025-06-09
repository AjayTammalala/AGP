import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ModuleComponent } from './module/module.component';
import { MethodsComponent } from './methods/methods.component';




const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "home", component: HomeComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    {path: 'module', component: ModuleComponent},
    {path: 'methods/:id', component: MethodsComponent},
    { path: 'settings', component: SettingsComponent }
   
  ]
},
{path: "**", redirectTo: 'module'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
