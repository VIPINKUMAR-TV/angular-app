import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Day } from '../../shared/models/day';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  
  private apiUrlDays = environment.apiBaseUrl + '/api/days';
  //private apiUrlDays ='http://k8s-default-expensei-7fed6ed2a9-1709962570.ap-south-1.elb.amazonaws.com/api/days';
  //private apiUrlDays ='http://a92db384801744ac59b9b4b2b9a0506d-955280071.ap-south-1.elb.amazonaws.com/api/days';
  //private apiUrlDays = 'http://localhost:8080/api/days';
  //private apiUrlDays = 'http://localhost:8081/api/days';
  //private createDayApiUrl= 'http://localhost:8081/api/days';
  //private mapCatToDaysUrl = `http://localhost:8081/api/days/${dayId}/categories/${catId}`;

  constructor(private http: HttpClient) {}

  getAllDays(): Observable<Day[]> {
    console.log('day sevice -getAllDays');
    return this.http.get<Day[]>(this.apiUrlDays);
  }

  createDay1(): Observable<Day> {
     console.log('day sevice -createDay1()');
  const newDay = { categories: [] }; // backend will assign a new dayId
  return this.http.post<Day>(`${this.apiUrlDays}`, newDay);
}

createDay(payload: any): Observable<any> {
   console.log('day sevice -createDay(),payload=',payload);
    return this.http.post<any>(this.apiUrlDays, payload);
  }
  saveDay(day: Day): Observable<Day> {
    return this.http.post<Day>(this.apiUrlDays, day);
  }

  addCategoryToDay(dayId: number, catId: number): Observable<Day>{
  console.log('day sevice -addCategoryToDay()');
  const payload='';
   //const mapCatToDaysUrl = `http://localhost:8080/api/days/${dayId}/categories/${catId}`;
   const mapCatToDaysUrl = `${this.apiUrlDays}/${dayId}/categories/${catId}`;
    return this.http.post<Day>(mapCatToDaysUrl,payload);
  }

  updateAmount(dayId: number, catId: number, amount: number): Observable<any> {
  console.log('update service started to add amount');
    return this.http.post(`${this.apiUrlDays}/${dayId}/categories/${catId}/amounts`, { amount });
}
softDeleteDay(dayId: number) {
  return this.http.delete(`${this.apiUrlDays}/${dayId}`);
}

undoDeleteDay(dayId: number):Observable<any> {
  return this.http.post(`${this.apiUrlDays}/${dayId}/undo-delete`, {});
}
}
