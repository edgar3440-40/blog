import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LayoutComponent} from "./shared/layout/layout.component";
import {SharedModule} from "./shared/shared.module";
import {HeaderComponent} from "./shared/layout/header/header.component";
import {FooterComponent} from "./shared/layout/footer/footer.component";
import { LoginComponent } from './views/user/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./core/auth/auth-interceptor";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {CarouselModule} from "ngx-owl-carousel-o";
import {CommonModule} from "@angular/common";
import {MainComponent} from "./views/main/main.component";
import { PolicyComponent } from './views/policy/policy.component';
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {DialogModule} from "@angular/cdk/dialog";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {appInitializer} from "./core/initializer/app-initializer";
import {UserService} from "./shared/services/user.service";


@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    LoginComponent,
    PolicyComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatSnackBarModule,
    CarouselModule,
    MatMenuModule,
    DialogModule,
    AppRoutingModule,

  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi : true},
    {provide: APP_INITIALIZER, useFactory: appInitializer, deps: [UserService], multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
