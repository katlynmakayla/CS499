import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TripListing } from './trip-listing/trip-listing';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Travlr Getaways Admin';
}
