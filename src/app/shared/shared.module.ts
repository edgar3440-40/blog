import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import {LoaderComponent} from "./components/loader/loader.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    ArticleCardComponent,
    CategoryFilterComponent,
    LoaderComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ArticleCardComponent,
    CategoryFilterComponent,
    LoaderComponent
    ]

})
export class SharedModule { }
