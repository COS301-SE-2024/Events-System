import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EventComponent } from './event.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, EventComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    component.event = {
      title: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      startDate: new Date(),
      endDate: new Date(),
      socialClub: 'testClub',
      eventPreparation: ['Preparation 1', 'Preparation 2'],
      eventAgendas: ['Agenda 1', 'Agenda 2'],
      eventDietaryAccommodations: ['Vegetarian', 'Vegan'] // Add this line
    };
    component.club = {
      name: 'Test Club',
      summaryDescription: 'Test Summary'
    };
    component.host = {
      firstName: 'John',
      lastName: 'Doe'
    };
    component.isLoading = false;
    component.hasUserRSVPd = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title and description', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'))?.nativeElement;
    const descriptionElement = fixture.debugElement.query(By.css('h2'))?.nativeElement;
    expect(titleElement?.textContent).toContain('Test Event');
    expect(descriptionElement?.textContent).toContain('Test Description');
  });

  it('should display club name and summary', () => {
    const clubNameElement = fixture.debugElement.query(By.css('.card-title'))?.nativeElement;
    const clubSummaryElement = fixture.debugElement.query(By.css('.card-body p'))?.nativeElement;
    expect(clubNameElement?.textContent).toContain('Test Club');
    expect(clubSummaryElement?.textContent).toContain('Test Summary');
  });

  it('should display host name and event location', () => {
    const hostNameElement = fixture.debugElement.query(By.css('.fa-user'))?.parent?.nativeElement;
    const locationElement = fixture.debugElement.query(By.css('.fa-location-pin'))?.parent?.nativeElement;
    expect(hostNameElement?.textContent).toContain('John Doe');
    expect(locationElement?.textContent).toContain('Test Location');
  });


  it('should display event preparations', () => {
    const preparationElements = fixture.debugElement.queryAll(By.css('.step'));
    expect(preparationElements.length).toBe(2);
    expect(preparationElements[0]?.nativeElement.textContent).toContain('Preparation 1');
    expect(preparationElements[1]?.nativeElement.textContent).toContain('Preparation 2');
  });

  it('should display event agendas', () => {
    const agendaElements = fixture.debugElement.queryAll(By.css('.timeline-box'));
    expect(agendaElements.length).toBe(2);
    expect(agendaElements[0]?.nativeElement.textContent).toContain('Agenda 1');
    expect(agendaElements[1]?.nativeElement.textContent).toContain('Agenda 2');
  });





  // Add more tests as needed
});
