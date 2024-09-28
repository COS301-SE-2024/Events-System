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

  it('should display event details', () => {
    component.eventTitle = 'Test Event';
    component.Description = 'This is a test event description';
    component.imageSource = 'test-image.jpg';
    component.eventID = 'testId';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.font-karla'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const descriptionElement = fixture.debugElement.query(By.css('.font-roboto'));
    expect(descriptionElement.nativeElement.textContent).toContain('This is a test event description');

    const imageElement = fixture.debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.src).toContain('test-image.jpg');
  });

  it('should have correct router links', () => {
    component.eventID = 'testId';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(4);

    const checkInButton = buttons[0];
    expect(checkInButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/hostcheckin,testId');

    const previewButton = buttons[1];
    expect(previewButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,testId');

    const editButton = buttons[2];
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateevent,testId');

    const deleteButton = buttons[3];
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteevent,testId');
  });
});