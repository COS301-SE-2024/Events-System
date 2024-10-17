import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventComponent } from './event.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { RandomHeaderService } from '../app/random-header.service';
import { GoogleMapsLoaderService } from 'src/app/google-maps-loader.service';
import { EventTourService } from './Eventtour.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, GoogleMapsModule, EventComponent, NoopAnimationsModule],
      providers: [
        RandomHeaderService,
        GoogleMapsLoaderService,
        EventTourService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-id' }),
            queryParams: of({ startTour: 'true' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;

    // Mock data initialization
    component.event = {
      title: 'Test Event',
      description: 'Test Description',
      eventAgendas: ['Agenda 1', 'Agenda 2'],
      eventPreparation: ['Preparation 1', 'Preparation 2'],
      eventDietaryAccommodations: ['Vegetarian', 'Vegan']
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

  it('should display event agendas', () => {
    const agendaElements = fixture.debugElement.queryAll(By.css('.timeline-box'));
    expect(agendaElements.length).toBe(2);
    expect(agendaElements[0].nativeElement.textContent).toContain('Agenda 1');
    expect(agendaElements[1].nativeElement.textContent).toContain('Agenda 2');
  });

  it('should display event preparations', () => {
    const preparationElements = fixture.debugElement.queryAll(By.css('.step'));
    expect(preparationElements.length).toBe(2);
    expect(preparationElements[0].nativeElement.textContent).toContain('Preparation 1');
    expect(preparationElements[1].nativeElement.textContent).toContain('Preparation 2');
  });

  it('should display dietary accommodations', () => {
    const dietaryElements = fixture.debugElement.queryAll(By.css('.border'));
    expect(dietaryElements.length).toBe(4);
  });
});