import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTrip implements OnInit {
  public addForm!: FormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tripService: TripData,
    private readonly router: Router,
    private readonly authService: Authentication,
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in and has the admin role
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/']); // or home page
      return;
    }

    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
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

    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value).subscribe({
        next: (data: any) => {
          console.log(data);
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
    return this.addForm.controls;
  }
}
