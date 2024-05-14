import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../utlis/active-params.util";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() category!: CategoryType;
  @Input() index!: number;

  @Input() activeFlag!: boolean;


  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  activeParams: ActiveParamsType = {categories: []};

  active: boolean = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      this.activeParams = ActiveParamsUtil.processParams(params);


      if(params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
      }
      if(this.category && this.activeParams.categories.some(url => this.category.url === url)) {
        this.active = true;
      } else if (this.category && this.category.url && !this.activeFlag) {
        console.log(this.activeFlag)
        this.active = this.activeFlag;
      }
    })
  }

  updateFilterParam(url: string, checked: boolean) {
  //   checking if there is anything in activeParams

    if(this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryParams = this.activeParams.categories.find(item => item === url);
      if(existingCategoryParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url)
        this.active = false;
        // deleting from the url params
      }
      else if(!existingCategoryParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
        this.active = true;
      }
      else if(!existingCategoryParams && !this.activeFlag && checked) {
        this.active = false;
      }
    } else if(checked) {
      this.activeParams.categories = [url];
      this.active = true;
    }
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

}
