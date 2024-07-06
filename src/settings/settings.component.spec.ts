import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let saveChangesSpy: jest.SpyInstance;
  let deleteAccountSpy: jest.SpyInstance;

  beforeEach(async () => {
    saveChangesSpy = jest.spyOn(SettingsComponent.prototype, 'saveChanges');
    deleteAccountSpy = jest.spyOn(SettingsComponent.prototype, 'deleteAccount');
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

  afterEach(() => {
    if (saveChangesSpy) {
      saveChangesSpy.mockRestore();
    }
    if (deleteAccountSpy) {
      deleteAccountSpy.mockRestore();
    }
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

    const descriptionInput = screen.getByPlaceholderText(/Bio/i);
    fireEvent.input(descriptionInput, { target: { value: 'A brief description' } });
    expect(descriptionInput).toHaveValue('A brief description');
  });

  it('should update the social media links inputs correctly', async () => {
    const emailInput = screen.getByPlaceholderText(/E-mail/i);
    fireEvent.input(emailInput, { target: { value: 'john.doe@example.com' } });
    expect(emailInput).toHaveValue('john.doe@example.com');

    const xInput = screen.getByPlaceholderText(/Twitter/i);
    fireEvent.input(xInput, { target: { value: '@johndoe' } });
    expect(xInput).toHaveValue('@johndoe');

    const linkedInInput = screen.getByPlaceholderText(/LinkedIn/i);
    fireEvent.input(linkedInInput, { target: { value: 'linkedin.com/in/johndoe' } });
    expect(linkedInInput).toHaveValue('linkedin.com/in/johndoe');

    const gitHubInput = screen.getByPlaceholderText(/Github/i);
    fireEvent.input(gitHubInput, { target: { value: 'github.com/johndoe' } });
    expect(gitHubInput).toHaveValue('github.com/johndoe');
  });

  it('should call saveChanges when Save changes button is clicked', async () => {
    const saveChangesButton = screen.getAllByText(/Save changes/i)[0];
    fireEvent.click(saveChangesButton);
    expect(saveChangesSpy).toHaveBeenCalled();
  });

  it('should call deleteAccount when Delete Account button is clicked', async () => {
    const securityTab = screen.getByText(/Security/i);
    fireEvent.click(securityTab);
    const deleteAccountButton = await screen.findByText(/Delete Account/i);
    fireEvent.click(deleteAccountButton);
    const deleteAccountSpy = jest.spyOn(SettingsComponent.prototype, 'deleteAccount');
    expect(deleteAccountSpy).toHaveBeenCalled();
  });
});
