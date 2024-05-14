import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  doRequest(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {name, phone, service, type})
  }
}
