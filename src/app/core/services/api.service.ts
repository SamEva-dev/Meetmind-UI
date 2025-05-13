import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly versionUrl = '/v1';  // adapte si ton API est préfixée différemment
  private readonly baseUrl = `${environment.apiUrl}${this.versionUrl}`; // adapte si ton API est préfixée différemment

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
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
