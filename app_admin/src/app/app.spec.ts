import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { Authentication } from './services/authentication';

describe('App', () => {
  beforeEach(async () => {
    const fakeAuthService = {
      isLoggedIn: () => false,
      logout: () => {},
      getToken: () => ''
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: Authentication, useValue: fakeAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /* didn't include the title in app.ts
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();   
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();   
    expect(compiled.querySelector('h1')?.textContent).toContain('Travlr Getaways Admin');
  });
  */
});
