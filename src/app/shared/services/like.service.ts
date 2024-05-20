import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {ArticleActionsType} from "../../../types/article-actions.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }

  applyAction(action: string, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action',  {action}, )
  }

  getArticleCommentsActions(params: {articleId: string}): Observable<ArticleActionsType[] | DefaultResponseType> {
    return this.http.get<ArticleActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions',
      {params: params} )
  }
  getActionsForComment( commentId: string): Observable<ArticleActionsType[] | DefaultResponseType> {
    return this.http.get<ArticleActionsType[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions')
  }

}
