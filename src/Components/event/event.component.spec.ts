import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventComponent } from './event.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EventComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    component.eventTitle = 'Test Event';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.collapse-title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');
  });

  it('should display event details', () => {
    component.eventTitle = 'Test Event';
    component.imageSource = 'test-image.jpg';
    component.description = 'Test Description';
    component.startDate = '2023-01-01'; // Use valid date string
    component.endDate = '2023-01-02'; // Use valid date string
    component.endTime = '2023-01-02T18:00:00Z'; // Use valid date-time string
    component.location = 'Test Location';
    component.hostedBy = 'Test Host';
    component.socialClub = 'Test Club';
    fixture.detectChanges();

    const cardTitleElement = fixture.debugElement.query(By.css('.card-title'));
    expect(cardTitleElement.nativeElement.textContent).toContain('Test Event');

    const descriptionElement = fixture.debugElement.query(By.css('.card-body p:nth-child(2)'));
    expect(descriptionElement.nativeElement.textContent).toContain('Test Description');

    const datesElement = fixture.debugElement.query(By.css('.card-body p:nth-child(3)'));
    expect(datesElement.nativeElement.textContent).toContain('Dates: 1/1/23 - 1/2/23');

    const timesElement = fixture.debugElement.query(By.css('.card-body p:nth-child(4)'));
    expect(timesElement.nativeElement.textContent).toContain('Times: 8:00 PM');

    const locationElement = fixture.debugElement.query(By.css('.card-body p:nth-child(5)'));
    expect(locationElement.nativeElement.textContent).toContain('Test Location');

    const hostedByElement = fixture.debugElement.query(By.css('.card-body p:nth-child(6)'));
    expect(hostedByElement.nativeElement.textContent).toContain('Hosted BY: Test Host');

    const socialClubElement = fixture.debugElement.query(By.css('.card-body p:nth-child(7)'));
    expect(socialClubElement.nativeElement.textContent).toContain('Social Club: Test Club');
  });

  it('should display join event button', () => {
    const joinButton = fixture.debugElement.query(By.css('.btn-primary'));
    expect(joinButton).toBeTruthy();
  });
});
