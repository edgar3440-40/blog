import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CommentType} from "../../../types/comment.type";
import {ActiveParamsCommentType} from "../../../types/active-params-comment.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article})
  }

  getComments(params: ActiveParamsCommentType): Observable<CommentType | DefaultResponseType> {
    return this.http.get<CommentType | DefaultResponseType>(environment.api + 'comments', {params})
  }
}
