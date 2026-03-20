import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError: string = '';
  submitted = false;

  credentials = {
    email: '',
    password: '',
  }

  constructor(
    private readonly authenticationService: Authentication,
    private readonly router: Router
  ) { }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password ) {
      this.formError = 'All fields are required, please try again.';
      this.router.navigateByUrl('#'); // stay on the login page
    } else {
      this.doLogin();

    }
  }

  private doLogin(): void {
    let User = {
      email: this.credentials.email,
    } as User;
    //console.log('LoginComponent::doLogin');
    //console.log(this.credentials);
    this.authenticationService.login(User,
      this.credentials.password);
    if (this.authenticationService.isLoggedIn()) {
      // console.log('Router::Direct');
      this.router.navigate(['']);
    } else {
      setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          // console.log('Router::Pause');
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}
