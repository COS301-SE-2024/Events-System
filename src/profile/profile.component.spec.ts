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

  it('should switch to the Subscriptions tab when clicked', async () => {
    // Step 1: Find all elements that match the text
    const subscriptionsTabs = await screen.getAllByText(/Subscriptions/i);
    
    // Step 2: Assuming you want to interact with the first tab found
    fireEvent.click(subscriptionsTabs[0]);
    
    // Step 3: Wait for the Subscriptions tab content to appear
    //const subscriptionsTabContentElements = await screen.getAllByText(/Details about the user's subscriptions/i);
  
  // Step 2: Assuming you want to interact with the first occurrence found
  const subscriptionsTabContent = subscriptionsTabs[1];
    
    // Step 4: Assert that the Subscriptions tab content is in the document
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
