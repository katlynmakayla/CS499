import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-delete-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delete-trip.html',
  styleUrls: ['./delete-trip.css'],
  providers: [TripData]
})
export class DeleteTrip implements OnInit {
  public deleteForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly tripDataService: TripData,
    private readonly authService: Authentication,   // add this
  ) { }

  ngOnInit(): void {
    // Check if the user is logged in and has the admin role
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      this.message = "No trip selected for deletion!";
      this.router.navigate(['']);
      return;
    }

    this.deleteForm = this.formBuilder.group({
      _id: [],
      code:         [{ value: tripCode, disabled: true }, Validators.required],
      name:         [{ value: '', disabled: true }, Validators.required],
      lengthInDays: [{ value: '', disabled: true }, Validators.required], 
      start:        [{ value: '', disabled: true }, Validators.required],
      resort:       [{ value: '', disabled: true }, Validators.required],
      price:        [{ value: '', disabled: true }, Validators.required], 
      image:        [{ value: '', disabled: true }, Validators.required],
      description:  [{ value: '', disabled: true }, Validators.required],
      tags: this.formBuilder.group({
        climate:      [{ value: '', disabled: true }],
        activityType: [{ value: '', disabled: true }],
        budgetRange:  [{ value: '', disabled: true }],
        tripDuration: [{ value: '', disabled: true }],
      }),
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        if (value?.[0]) {
          this.trip = value[0];
          this.deleteForm.patchValue(this.trip);
          this.message = `Trip "${tripCode}" loaded. Confirm deletion below.`;
        } else {
          this.message = "Trip not found!";
        }
      },
      error: (err) => {
        console.error(err);
        this.message = "Error retrieving trip.";
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    // extra check to make sure user is admin
    if (!this.authService.isAdmin()) {
      console.log('Unauthorized attempt');
      this.router.navigate(['/']);
      return;
    }

    if (!this.trip) return;

    this.tripDataService.deleteTrip(this.trip.code).subscribe({
      next: () => {
        console.log(`Trip "${this.trip.name}" deleted successfully`);
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
        this.message = "Error deleting trip.";
      }
    });
  }

  backToListing(): void {
    this.router.navigate(['']);
  }

  get f() {
    return this.deleteForm.controls;
  }
}