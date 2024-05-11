import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    CategoryFilterComponent
  ],
    exports: [
        ArticleCardComponent,
        CategoryFilterComponent
    ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
