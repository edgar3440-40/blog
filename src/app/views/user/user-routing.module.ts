import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as path from "path";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
