import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventCardComponent } from './eventCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, EventCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details', () => {
    component.imageSource = 'test-image.jpg';
    component.eventTitle = 'Test Event';
    component.hostedBy = 'Test Host';
    component.location = 'Test Location';
    component.startTime = '10:00 AM';
    component.endTime = '6:00 PM';
    component.startDate = '2023-01-01';
    component.endDate = '2023-01-02';
    component.eventID = 'testId';
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('test-image.jpg');

    const titleElement = fixture.debugElement.query(By.css('h5'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const hostedByElement = fixture.debugElement.query(By.css('p:nth-child(2)'));
    expect(hostedByElement.nativeElement.textContent).toContain('Test Host');

    const locationElement = fixture.debugElement.query(By.css('p:nth-child(3)'));
    expect(locationElement.nativeElement.textContent).toContain('Test Location');

    const timeElement = fixture.debugElement.query(By.css('p:nth-child(4)'));
    expect(timeElement.nativeElement.textContent).toContain('10:00 AM - 6:00 PM');

    const dateElement = fixture.debugElement.query(By.css('p:nth-child(5)'));
    expect(dateElement.nativeElement.textContent).toContain('1 Jan - 2 Jan');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');
  });
});
