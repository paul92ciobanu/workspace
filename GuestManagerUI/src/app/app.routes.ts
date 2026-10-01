import { Routes } from '@angular/router';
import { AddGuestComponent } from './pages/add-guest/add-guest.component';
import { ShowGuestComponent } from './pages/show-guest/show-guest.component';
import { ViewGuestComponent } from './pages/view-guest/view-guest.component';
import { EditGuestComponent } from './pages/edit-guest/edit-guest.component';

export const routes: Routes = [
  { path: 'guests', component: ShowGuestComponent },
  { path: 'add', component: AddGuestComponent },
  { path: 'view-guest/:id', component: ViewGuestComponent },
  { path: 'edit-guest/:id', component: EditGuestComponent },
  { path: '', redirectTo: 'guests', pathMatch: 'full' },
  { path: '**', redirectTo: 'guests' },
];
