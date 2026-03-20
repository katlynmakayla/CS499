import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { DeleteTrip } from './delete-trip/delete-trip';
import { Login } from './login/login';
import { Register } from './register/register'

export const routes: Routes = [
  { path: '', component: TripListing, pathMatch: 'full' },
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTrip },
  { path: 'delete-trip', component: DeleteTrip },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];