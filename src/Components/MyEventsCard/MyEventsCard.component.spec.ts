import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MyEventsCardComponent } from './MyEventsCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('MyEventsCardComponent', () => {
  let component: MyEventsCardComponent;
  let fixture: ComponentFixture<MyEventsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, MyEventsCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details in alert section', () => {
    component.eventTitle = 'Test Event';
    component.eventID = 'testId';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'));
    expect(alertElement).toBeTruthy();

    const titleElement = alertElement.query(By.css('span'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const checkInButton = alertElement.query(By.css('button:nth-child(1)'));
    expect(checkInButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/hostcheckin,testId');

    const moreDetailsButton = alertElement.query(By.css('button:nth-child(2)'));
    expect(moreDetailsButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');

    const editButton = alertElement.query(By.css('button:nth-child(3)'));
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateevent,testId');

    const deleteButton = alertElement.query(By.css('button:nth-child(4)'));
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteevent,testId');
      
  });

  it('should display event details in collapse section', () => {
    component.eventTitle = 'Test Event';
    component.eventID = 'testId';
    fixture.detectChanges();

    const collapseElement = fixture.debugElement.query(By.css('.collapse'));
    expect(collapseElement).toBeTruthy();

    const titleElement = collapseElement.query(By.css('.collapse-title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const checkInButton = alertElement.query(By.css('button:nth-child(1)'));
    expect(checkInButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/hostcheckin,testId');

    const moreDetailsButton = alertElement.query(By.css('button:nth-child(2)'));
    expect(moreDetailsButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');

    const editButton = alertElement.query(By.css('button:nth-child(3)'));
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateevent,testId');

    const deleteButton = alertElement.query(By.css('button:nth-child(4)'));
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteevent,testId');
  });

  it('should display modal with delete confirmation', () => {
    component.eventTitle = 'Test Event';
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal'));
    expect(modalElement).toBeTruthy();

    const modalTitle = modalElement.query(By.css('h3'));
    expect(modalTitle.nativeElement.textContent).toContain('Delete Test Event');

    const modalContent = modalElement.query(By.css('p'));
    expect(modalContent.nativeElement.textContent).toContain('Are you sure you want to delete this event?');

    const cancelButton = modalElement.query(By.css('.btn-warning'));
    expect(cancelButton.nativeElement.textContent).toContain('Cancel');

    const deleteButton = modalElement.query(By.css('.btn-error'));
    expect(deleteButton.nativeElement.textContent).toContain('Delete my Event');
  });

  it('should display loading toast', () => {
    component.isAPILoading = true;
    fixture.detectChanges();

    const loadingToast = fixture.debugElement.query(By.css('.toast .alert-info'));
    expect(loadingToast).toBeTruthy();
  });

  it('should display success toast', () => {
    component.showsuccessToast = true;
    fixture.detectChanges();

    const successToast = fixture.debugElement.query(By.css('.toast .alert-success'));
    expect(successToast).toBeTruthy();
    expect(successToast.nativeElement.textContent).toContain('Event succesfully Deleted');
  });

  it('should display error toast', () => {
    component.showfailToast = true;
    fixture.detectChanges();

    const errorToast = fixture.debugElement.query(By.css('.toast .alert-error'));
    expect(errorToast).toBeTruthy();
    expect(errorToast.nativeElement.textContent).toContain('error Deleting event');
  });
});
