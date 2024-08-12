import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchEventCardComponent } from './searchEventCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('SearchEventCardComponent', () => {
  let component: SearchEventCardComponent;
  let fixture: ComponentFixture<SearchEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, SearchEventCardComponent, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details correctly', () => {
    component.imageSource = 'test-image.jpg';
    component.eventTitle = 'Test Event';
    component.eventDescription = 'This is a test event description.';
    component.startDate = '2023-01-01';
    component.endDate = '2023-01-02';
    component.startTime = '10:00 AM';
    component.endTime = '6:00 PM';
    component.eventID = 'testId';
    component.hasUserRSVPd = false;
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('test-image.jpg');

    const titleElement = fixture.debugElement.query(By.css('.font-karla'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const descriptionElement = fixture.debugElement.query(By.css('.font-roboto.text-sm'));
    expect(descriptionElement.nativeElement.textContent).toContain('This is a test event description.');

    const timeElement = fixture.debugElement.query(By.css('.fa-clock'));
    expect(timeElement.nativeElement.parentElement.textContent).toContain(' 10:00 - 6:00');

    const dateElement = fixture.debugElement.query(By.css('.fa-calendar-days'));
    expect(dateElement.nativeElement.parentElement.textContent).toContain('01 Jan - 02 Jan');

  });
});
