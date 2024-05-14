import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ArticleRoutingModule } from './article-routing.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {CarouselModule} from "ngx-owl-carousel-o";
import {MatMenuModule} from "@angular/material/menu";
import {SharedModule} from "../../shared/shared.module";
import {CatalogComponent} from "./catalog/catalog.component";
import {DetailComponent} from "./detail/detail.component";
@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ArticleRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class ArticleModule { }
