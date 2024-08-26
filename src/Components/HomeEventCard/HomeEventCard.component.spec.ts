import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeEventCardComponent } from './HomeEventCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('HomeEventCardComponent', () => {
  let component: HomeEventCardComponent;
  let fixture: ComponentFixture<HomeEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, HomeEventCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEventCardComponent);
    component = fixture.componentInstance;
    component.tags = []; // Initialize tags property
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details', () => {
    component.imageSource = 'test-image.jpg';
    component.eventTitle = 'Test Event';
    component.hostName = 'Test Host';
    component.startDate = '2023-01-01';
    component.endDate = '2023-01-02';
    component.startTime = '10:00 AM';
    component.endTime = '6:00 PM';
    component.eventID = 'testId';
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('test-image.jpg');

    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const hostElement = fixture.debugElement.query(By.css('p:nth-child(1) span'));
    expect(hostElement.nativeElement.textContent).toContain('Test Host');

    const dateElement = fixture.debugElement.query(By.css('p:nth-child(2) span'));
    expect(dateElement.nativeElement.textContent).toContain('01 Jan - 02 Jan');

    const timeElement = fixture.debugElement.query(By.css('p:nth-child(3) span'));
    expect(timeElement.nativeElement.textContent).toContain(' 10:00 - 6:00');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');
  });
});
