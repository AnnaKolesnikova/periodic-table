import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ELEMENT_DATA } from '../constants/mockData';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data = ELEMENT_DATA;

  constructor() {}

  fetchData(): Observable<any> {
    return of(this.data).pipe(delay(2000));
  }
}
