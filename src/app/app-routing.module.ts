import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./CommonForms/Users/users/users.component";
import { RolesComponent } from "./CommonForms/Roles/roles/roles.component";
import { FormsComponent } from "./CommonForms/Forms/forms/forms.component";
import { AuthGuard } from "./Service/auth.guard";
// import { OrderlistComponent } from "./orderpages/orderlist/orderlist.component";
const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "users", component: UsersComponent , canActivate: [AuthGuard] },
  { path: "roles", component: RolesComponent , canActivate: [AuthGuard]},
  { path: "forms", component: FormsComponent , canActivate: [AuthGuard]},
  { path: "dashboard", component: DashboardComponent },

  {
    path: 'masters',
    loadChildren: () =>
      import('./Pages/Master Module/masters.module').then(
        (m) => m.MasterModule
      ),
  },

 
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
