import { render, screen, waitFor } from '@testing-library/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { HostCheckinComponent } from './host-checkin.component';

describe('HostCheckinComponent', () => {
  let component: HostCheckinComponent;

  beforeEach(async () => {
    const { fixture } = await render(HostCheckinComponent, {
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['eventId', 'testId']]))
          }
        }
      ]
    });

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch RSVPed employees on init', async () => {
    // Mock the HTTP request
    const mockResponse = [
      {
        employee: {
          employeeId: 25,
          firstName: 'Nolan',
          lastName: 'Grayson',
          email: 'thinkmark@gmail.com',
          // other properties...
        },
        rsvp: {
          rsvpId: 12,
          eventId: 65,
          employeeId: 25,
          status: 'Pending',
          rsvpAt: '2024-06-18T17:00:00.000+00:00'
        }
      }
      // Add more mock data if needed
    ];

    jest.spyOn(component['http'], 'get').mockReturnValue(of(mockResponse));

    component.ngOnInit();

    await waitFor(() => {
      expect(component.rsvpedEmployees).toHaveLength(mockResponse.length);
      expect(component.rsvpedEmployees[0].name).toBe('Nolan');
      expect(component.rsvpedEmployees[0].status).toBe('Pending');
    });
  });

  // Add more tests as needed for additional functionality
});
