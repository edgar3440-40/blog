import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import {LoaderComponent} from "./components/loader/loader.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ModalComponent } from './components/modal/modal.component';
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
  declarations: [
    ArticleCardComponent,
    CategoryFilterComponent,
    LoaderComponent,
    ModalComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  exports: [
    ArticleCardComponent,
    CategoryFilterComponent,
    LoaderComponent,
    ModalComponent
    ],


})
export class SharedModule { }
