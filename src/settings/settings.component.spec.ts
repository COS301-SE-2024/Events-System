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
});
