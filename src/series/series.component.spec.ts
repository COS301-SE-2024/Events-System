import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { SeriesComponent } from './series.component';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// Mock components for testing
@Component({
  selector: 'app-ghost-event-card',
  template: '<div class="ghost-event-card"></div>',
})
class MockGhostEventCardComponent {}

@Component({
  selector: 'app-event-card',
  template: '<div class="event-card"></div>',
})
class MockEventCardComponent {
  @Input() eventID!: string;
  @Input() eventTitle!: string;
  @Input() description!: string;
  @Input() startTime!: string;
  @Input() endTime!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() location!: string;
  @Input() hostedBy!: string;
  @Input() socialClub!: string;
}

describe('SeriesComponent', () => {
  let component: SeriesComponent;
  let fixture: ComponentFixture<SeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockGhostEventCardComponent,
        MockEventCardComponent,
      ],
      imports: [SeriesComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-id' }),
            queryParams: of({ startTour: 'true' })
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeletons when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const skeletons = fixture.debugElement.queryAll(By.css('.skeleton'));
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display series details when not loading', () => {
    component.isLoading = false;
    component.series = {
      name: 'Test Series',
      description: 'Test Description',
      host: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
    fixture.detectChanges();

    const seriesName = fixture.debugElement.query(By.css('h1')).nativeElement;
    const seriesDescription = fixture.debugElement.query(By.css('h2')).nativeElement;
    const hostName = fixture.debugElement.query(By.css('.card-title')).nativeElement;

    expect(seriesName.textContent).toContain('Test Series');
    expect(seriesDescription.textContent).toContain('Test Description');
    expect(hostName.textContent).toContain('Managed by: John Doe');
  });

  it('should display event cards when not loading', () => {
    component.isLoading = false;
    component.events = [
      {
        eventId: '1',
        title: 'Event 1',
        description: 'Description 1',
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        location: 'Location 1',
        host: {
          firstName: 'Alice',
          lastName: 'Smith',
        },
        socialClub: 'Club 1',
      },
    ];
    fixture.detectChanges();

    const eventCards = fixture.debugElement.queryAll(By.css('app-event-card'));
    expect(eventCards.length).toBe(1);
  });

  it('should display RSVP button when user has not RSVPd', () => {
    component.isLoading = false;
    component.hasUserRSVPd = false;
    fixture.detectChanges();

    const rsvpButton = fixture.debugElement.query(By.css('.btn.btn-accent'));
    expect(rsvpButton).toBeTruthy();
  });

  it('should display cancel booking button when user has RSVPd', () => {
    component.isLoading = false;
    component.hasUserRSVPd = true;
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.btn.btn-outline.btn-warning'));
    expect(cancelButton).toBeTruthy();
  });
});