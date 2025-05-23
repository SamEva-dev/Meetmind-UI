import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
private readonly versionUrl = '/v1';  // adapte si ton API est préfixée différemment
  private readonly baseUrl = `${environment.BASE_API}${this.versionUrl}`; // adapte si ton API est préfixée différemment

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    console.log('GET', `${this.baseUrl}${path}`, params);
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: this.buildParams(params) })
      .pipe(retry(1), catchError(this.handleError));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, params?: Record<string, any>): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { params: this.buildParams(params) })
      .pipe(catchError(this.handleError));
  }

  getBlob(path: string): Observable<Blob> {
    console.log('GET Blob', `${this.baseUrl}${path}`);
    return this.http.get(`${this.baseUrl}${path}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private handleError(error: HttpErrorResponse) {
    // tu peux enrichir ici avec un toast ou un logger global
    let msg = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      msg = `Erreur client: ${error.error.message}`;
    } else {
      msg = `Erreur serveur ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(msg));
  }
}
