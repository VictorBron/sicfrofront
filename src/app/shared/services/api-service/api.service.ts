import { Injectable } from '@angular/core';
import { APIUrlObj } from '../../models';
import { EnvironmentService } from '../environment/environment.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private env: EnvironmentService) {}

  public getApiUrl(url: APIUrlObj): string {
    for (const param in url.params) {
      if (url.params.hasOwnProperty(param)) {
        const key = `{${url.params[param].key}}`;
        url.path = url.path.replace(key, url.params[param].value);
      }
    }

    return `${this.env.data.apiUrl}${url.path}`;
  }
}
