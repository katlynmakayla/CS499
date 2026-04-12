import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly tripDataService: TripData,
  ) {}

  ngOnInit(): void {
    // retrieve the trip code from local storage
    let tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      this.message = "Something wrong, couldn't find where I stashed tripCode!";
      this.router.navigate(['']);
      return;
    }
    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      lengthInDays: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      tags: this.formBuilder.group({
        climate: ['', Validators.required],
        activityType: ['', Validators.required],
        budgetRange: ['', Validators.required],
        tripDuration: ['', Validators.required],
      }),
    });
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;
        if (value?.[0]) {
          // convert date string from DB to yyyy-MM-dd
          const tripFromDb = { ...value[0] };
          if (tripFromDb.start) {
            const date = new Date(tripFromDb.start);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            tripFromDb.start = `${yyyy}-${mm}-${dd}`;
          }

          // patch the form safely
          this.editForm.patchValue(tripFromDb);
          this.message = 'Trip: ' + tripCode + ' retrieved';
        } else {
          this.message = 'No Trip Retrieved!';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }
  public onSubmit(): void {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        },
      });
    }
  }
  // get the form short name to access the form fields
  get f() {
    return this.editForm.controls;
  }
}
