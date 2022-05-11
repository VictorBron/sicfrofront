import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { generateRandomQueryId } from './../../utils/generateRandomQueryId/generate-random-query-id.util';
import { Environment } from './environment.model';

@Injectable()
export class EnvironmentService {
  public data: Environment;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<any> {
    const promise = this.http.get(generateRandomQueryId('config.json')).toPromise();
    promise.then(config => (this.data = config as Environment));
    return promise;
  }
}
