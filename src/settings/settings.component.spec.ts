import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  beforeEach(async () => {
    await render(SettingsComponent, {
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
    expect(SettingsComponent).toBeTruthy();
  });

  it('should display the My Details tab content by default', async () => {
    const detailsContent = screen.getByText(/Profile Details/i);
    expect(detailsContent).toBeInTheDocument();
  });

  it('should switch to the Security tab when clicked', async () => {
    // Find and click the Security tab
    const securityTab = screen.getByText(/Security/i);
    fireEvent.click(securityTab);

    // Verify the Security tab content is displayed
    const securityContent = await screen.findByText(/Change Password/i);
    expect(securityContent).toBeInTheDocument();
  });

  it('should update the profile details inputs correctly', async () => {
    const nameInput = screen.getAllByPlaceholderText(/Name/i)[0];
    fireEvent.input(nameInput, { target: { value: 'John' } });
    expect(nameInput).toHaveValue('John');

    const surnameInput = screen.getByPlaceholderText(/Surname/i);
    fireEvent.input(surnameInput, { target: { value: 'Doe' } });
    expect(surnameInput).toHaveValue('Doe');

    const descriptionInput = screen.getByPlaceholderText(/Description/i);
    fireEvent.input(descriptionInput, { target: { value: 'A brief description' } });
    expect(descriptionInput).toHaveValue('A brief description');
  });
});
