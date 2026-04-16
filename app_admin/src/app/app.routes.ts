import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { DeleteTrip } from './delete-trip/delete-trip';
import { Login } from './login/login';
import { Register } from './register/register'
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: TripListing, pathMatch: 'full', canActivate: [AuthGuard]  },
  { path: 'add-trip', component: AddTrip, canActivate: [AuthGuard] },
  { path: 'edit-trip', component: EditTrip, canActivate: [AuthGuard] },
  { path: 'delete-trip', component: DeleteTrip, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];