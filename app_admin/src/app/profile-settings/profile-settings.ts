import { Component, OnInit } from '@angular/core';
import { Authentication } from '../services/authentication';
import { UserData } from '../services/user-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProfileSettings implements OnInit {
  profile = { climate: '', activityType: '', budgetRange: 'moderate', tripDuration: 'week' };

  constructor(private userDataService: UserData) {}

  ngOnInit() {
    // Fetch existing profile on load
    this.userDataService.getProfile().subscribe((user: { profile: { climate: string; activityType: string; budgetRange: string; tripDuration: string; }; }) => {
      if (user.profile) this.profile = user.profile;
    });
  }

  onSave() {
    this.userDataService.updateProfile(this.profile).subscribe(() => {
        alert('Profile Updated!');
    });
  }
}
