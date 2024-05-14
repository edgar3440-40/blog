import { Component, OnInit } from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ArticlesArrayType} from "../../../../types/articles-array.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoriesService} from "../../../shared/services/categories.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryType} from "../../../../types/category.type";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utlis/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  articles!: ArticlesArrayType;
  appliedFilters: AppliedFilterType[] = [];
  filterOpen: boolean = false;
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  pages: number[] = [];

  activeFlag: boolean = false;
  filterUrlParam: string = '';

  constructor(private articleService: ArticleService, private categoriesService: CategoriesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {

    this.categoriesService.getCategories()
      .subscribe(data => {
        this.categories = data;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(1000)
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.appliedFilters = [];
            this.activeParams.categories.forEach(url => {

              for (let i = 0; i < this.categories.length; i++) {
                const foundCategory = this.categories[i].url === url ? this.categories[i] : null;
                if(foundCategory) {
                  this.appliedFilters.push({
                    name: foundCategory.name,
                    urlParam: foundCategory.url
                  });
                }
              }
            })
            this.articleService.getArticles(this.activeParams)
              .subscribe({
                next: (data: ArticlesArrayType) => {
                  this.pages = [];
                  for (let i = 1; i <= data.pages; i++) {
                    this.pages.push(i);
                  }
                  this.articles = data as ArticlesArrayType;
                }
              })
          })
      })
  }

  updateActive(newActive: boolean) {
    this.activeFlag = newActive;
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType, activeFlag: boolean) {

    this.activeFlag = activeFlag;

    this.activeParams.categories = this.activeParams.categories.filter(filter => filter !== appliedFilter.urlParam)


    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });

  }
  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  getIfOneOfCategoriesChosen(value: any) {
   return this.filterOpen = value as boolean;
  }

  openPrevPage() {
    if(this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if(this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }
  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

}
