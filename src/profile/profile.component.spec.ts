import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { ProfileComponent } from './profile.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, ProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }; // Initialize employeeData
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(ProfileComponent).toBeTruthy();
  });

  it('should display the About tab content by default', async () => {
    const aboutTabContent = await screen.getAllByText(/about me/i);
    expect(aboutTabContent[0]).toBeInTheDocument();
  });


  // it('should display the profile name and username', async () => {
  //   const profileNames = await screen.findAllByText(/profile name/i);
  //   const profileUsernames = await screen.findAllByText(/profile username/i);
  //   expect(profileNames[0]).toBeInTheDocument();
  //   expect(profileUsernames[0]).toBeInTheDocument();
  // });
  

  it('should have an Edit Profile button', async () => {
    const editProfileButtons = await screen.findAllByRole('button', { name: /edit profile/i });
    expect(editProfileButtons[0]).toBeInTheDocument(); // Use the first match or identify the specific element based on its position
  });
});
