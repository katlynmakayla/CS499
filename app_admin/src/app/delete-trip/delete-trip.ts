import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

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
    private readonly tripDataService: TripData
  ) { }

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      this.message = "No trip selected for deletion!";
      this.router.navigate(['']);
      return;
    }

    // Initialize form (all fields disabled)
    this.deleteForm = this.formBuilder.group({
      _id: [],
      code: [{ value: tripCode, disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      length: [{ value: '', disabled: true }, Validators.required],
      start: [{ value: '', disabled: true }, Validators.required],
      resort: [{ value: '', disabled: true }, Validators.required],
      perPerson: [{ value: '', disabled: true }, Validators.required],
      image: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required]
    });

    // Load trip details from service
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
  if (!this.trip) return;

  this.tripDataService.deleteTrip(this.trip.code).subscribe({
    next: () => {
      console.log(`Trip "${this.trip.name}" deleted successfully`);
      // Navigate back to listing instead of showing a blank form
      this.router.navigate(['']);
    },
    error: (err) => {
      console.error(err);
      this.message = "Error deleting trip.";
    }
  });
}

  /** Back to listing */
  backToListing(): void {
    this.router.navigate(['']);
  }

  // shorthand to access form controls in template
  get f() {
    return this.deleteForm.controls;
  }
}
