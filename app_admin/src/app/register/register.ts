import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  public formError = '';

  credentials = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private readonly authenticationService: Authentication,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef  
  ) {}

  public async onRegisterSubmit(): Promise<void> {

    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required.';
      return;
    }

    // Clear previous error
    this.formError = '';

    const newUser = {
      name: this.credentials.name,
      email: this.credentials.email,
    } as User;

    try {
      await this.authenticationService.register(newUser, this.credentials.password);
      this.router.navigate(['']); 
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';

      // Use ChangeDetectorRef to force Angular to update the form to show error message
      this.formError = errorMessage + ' Please log in instead.';
      this.cdr.detectChanges();

      console.error('Registration error:', err);
    }
  }
}
