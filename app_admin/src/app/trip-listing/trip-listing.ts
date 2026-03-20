import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCard } from "../trip-card/trip-card";
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})
export class TripListing implements OnInit {
  trips!: Trip[];
  message: string = '';

  constructor(
    private readonly tripDataService: TripData,
    private readonly router: Router,
    private readonly authenticationService: Authentication,
    // added to reload the trips because they kept disappearing after the first load
    private readonly cdr: ChangeDetectorRef) {
    console.log('trip-listing constructor');

  }
  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private getStuff(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: any) => {
        this.trips = value;
        this.cdr.detectChanges(); // ensures template updates
        if(value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available!';
        } else {
          this.message = 'There were no trips retrieved from the database.';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }
  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }

}
