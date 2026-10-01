import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateGuestRequest, Guest } from '../models/guest.model';

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8090/api/guests';

  getAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl);
  }

  getById(id: number): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiUrl}/${id}`);
  }

  create(guest: CreateGuestRequest): Observable<Guest> {
    return this.http.post<Guest>(this.apiUrl, guest);
  }

  update(id: number, guest: CreateGuestRequest): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiUrl}/${id}`, guest);
  }
}
