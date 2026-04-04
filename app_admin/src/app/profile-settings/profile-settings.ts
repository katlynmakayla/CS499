import { Component, OnInit, Inject } from '@angular/core';
import { Authentication } from '../services/authentication';
import { UserData } from '../services/user-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileSettings implements OnInit {
  profile = { climate: '', activityType: '', budgetRange: 'moderate', tripDuration: 'week' };

  constructor(
    private authService: Authentication,
    @Inject(UserData) private userDataService: UserData,
    private router: Router,
  ) {}

  ngOnInit() {
    // Redirect to login if not authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Fetch existing profile on load
    this.userDataService.getProfile().subscribe({
      next: (user: any) => {
        if (user.profile) this.profile = user.profile;
      },
      error: (err: any) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  onSave() {
    this.userDataService.updateProfile(this.profile).subscribe({
      next: () => {
        alert('Profile Updated!');
      },
      error: (err: any) => {
        console.error('Error saving profile:', err);
        alert('Failed to save profile. Please try again.');
      },
    });
  }
}
