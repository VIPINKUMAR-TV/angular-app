import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';


interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  sub: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl + '/api/auth';
  //private apiUrl = 'http://k8s-default-expensei-7fed6ed2a9-1709962570.ap-south-1.elb.amazonaws.com/api/auth';
   //private apiUrl = 'http://a92db384801744ac59b9b4b2b9a0506d-955280071.ap-south-1.elb.amazonaws.com/api/auth';
 //private apiUrl = 'http://localhost:8080/api/auth';
 //private apiUrl = '/api/auth';

 private readonly TOKEN_KEY = 'jwt';
 private userSubject = new BehaviorSubject<any>(this.getDecodedToken());
  user$ = this.userSubject.asObservable();
  // ✅ Use Angular signal to track login state reactively
  isLoggedIn = signal<boolean>(this.hasToken());
  currentUser1 = signal<JwtPayload | null>(this.getUserFromToken());
//user:any;
  constructor(private http: HttpClient) { 
    console.log('AuthService -constructor called');
  }

  register(data: any): Observable<any> {
    console.log('auth service',data);
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    //this.user = computed(() => this.currentUser());
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
     this.userSubject.next(this.getDecodedToken());
     this.isLoggedIn.set(true);
  }

   hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    console.log('inside logout auth');
    localStorage.removeItem(this.TOKEN_KEY);
     this.userSubject.next(null);
     this.isLoggedIn.set(false);
  }
  getDecodedToken() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
  currentUser() {
    return this.userSubject.value;
  }
  private getUserFromToken(): JwtPayload | null {
    console.log('inside getUserFromToken()');
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
}

