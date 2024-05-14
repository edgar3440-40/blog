import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticlesArrayType} from "../../../types/articles-array.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }


  getPopularArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top')
  }

  getArticles(params: ActiveParamsType): Observable<ArticlesArrayType> {
    return this.http.get<ArticlesArrayType>(environment.api + 'articles', {
      params: params
    })
  }
  getArticle(url: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }

  getRelatedArticles(url: string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/related/' + url)
  }
}
