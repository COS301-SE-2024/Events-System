import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  beforeEach(async () => {
    await render(ProfileComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' })
          }
        }
      ]
    });
  });

  it('should create', () => {
    expect(ProfileComponent).toBeTruthy();
  });

  it('should have an Edit Profile button', async () => {
    const editProfileButtons = await screen.findAllByRole('button', { name: /edit profile/i });
    expect(editProfileButtons[0]).toBeInTheDocument(); // Use the first match or identify the specific element based on its position
  });
});
