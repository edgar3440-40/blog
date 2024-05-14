import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogComponent} from "./catalog/catalog.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
  {path: 'articles', component: CatalogComponent},
  {path: 'articles/:url', component: DetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
