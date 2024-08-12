import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeFeaturedEventComponent } from './HomeFeaturedEvent.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('HomeFeaturedEventComponent', () => {
  let component: HomeFeaturedEventComponent;
  let fixture: ComponentFixture<HomeFeaturedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, HomeFeaturedEventComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFeaturedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details', () => {
    component.imageSource = 'test-image.jpg';
    component.eventTitle = 'Test Event';
    component.eventDescription = 'This is a test event description.';
    component.hostName = 'Test Host';
    component.hostEmail = 'test@example.com';
    component.startDate = '2023-01-01';
    component.endDate = '2023-01-02';
    component.startTime = '10:00 AM';
    component.endTime = '6:00 PM';
    component.eventID = 'testId';
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('test-image.jpg');

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');


    const hostElement = fixture.debugElement.query(By.css('p:nth-child(1) span'));
    expect(hostElement.nativeElement.textContent).toContain('Test Host');

    const emailElement = fixture.debugElement.query(By.css('p:nth-child(2) span'));
    expect(emailElement.nativeElement.textContent).toContain('test@example.com');

    const dateElement = fixture.debugElement.query(By.css('p:nth-child(3) span'));
    expect(dateElement.nativeElement.textContent).toContain('01 Jan - 02 Jan');

    const timeElement = fixture.debugElement.query(By.css('p:nth-child(4) span'));
    expect(timeElement.nativeElement.textContent).toContain(' 10:00 - 6:00');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');
  });
});
