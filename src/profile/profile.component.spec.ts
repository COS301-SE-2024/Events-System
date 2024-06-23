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

  it('should display the About tab content by default', async () => {
    const aboutTabContent = await screen.getAllByText(/about me/i);
    expect(aboutTabContent[0]).toBeInTheDocument();
  });

  it('should switch to the Events history tab when clicked', async () => {
    const EventsTabs = await screen.getAllByText(/Events History/i);
    fireEvent.click(EventsTabs[0]);
  const EventsTabContent = await screen.getAllByText(/Event Title/i);
    expect(EventsTabContent[0]).toBeInTheDocument();
  });

  it('should switch to the Subscriptions tab when clicked', async () => {
    const subscriptionsTabs = await screen.getAllByText(/Subscriptions/i);
    fireEvent.click(subscriptionsTabs[0]);
  const subscriptionsTabContent = subscriptionsTabs[1];
    expect(subscriptionsTabContent).toBeInTheDocument();
  });

  it('should display the profile name and username', async () => {
    const profileNames = await screen.findAllByText(/profile name/i);
    const profileUsernames = await screen.findAllByText(/profile username/i);
    expect(profileNames[0]).toBeInTheDocument();
    expect(profileUsernames[0]).toBeInTheDocument();
  });
  

  it('should have an Edit Profile button', async () => {
    const editProfileButtons = await screen.findAllByRole('button', { name: /edit profile/i });
    expect(editProfileButtons[0]).toBeInTheDocument(); // Use the first match or identify the specific element based on its position
  });
});
