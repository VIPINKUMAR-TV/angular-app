import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../shared/models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   private getAllCategoryUrl = environment.apiBaseUrl + '/api/categories';
  //private getAllCategoryUrl = 'http://k8s-default-expensei-7fed6ed2a9-1709962570.ap-south-1.elb.amazonaws.com/api/categories';
  //private getAllCategoryUrl ='http://a92db384801744ac59b9b4b2b9a0506d-955280071.ap-south-1.elb.amazonaws.com/api/categories';
//private getAllCategoryUrl ='http://localhost:8080/api/categories';
  //private getAllCategoryUrl = 'http://localhost:8082/api/categories';
  
  constructor(private http: HttpClient) { }

   getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.getAllCategoryUrl);
  }

  // createCategory(category: Category): Observable<Category> {
  //   return this.http.post<Category>(this.getAllCategoryUrl, category);
  // }
  createCategory(payload: any): Observable<any> {
    return this.http.post<any>(this.getAllCategoryUrl, payload);
  }

}
