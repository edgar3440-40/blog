import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  doRequest(name: string, phone: string,  type: string, service?: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {name, phone, service, type})
  }

  private articleCategorySource = new BehaviorSubject<string>('defaultCategory');
  articleCategory$ = this.articleCategorySource.asObservable();

  setArticleCategory(category: string) {
    this.articleCategorySource.next(category);
  }
  private isConsultation = new BehaviorSubject<boolean>(false);
  isConsultation$ = this.isConsultation.asObservable();

  setIsConsultation(category: boolean) {
    this.isConsultation.next(category);
  }
}
