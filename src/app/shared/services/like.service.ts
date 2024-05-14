import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }

  applyAction(action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {action})
  }
}
