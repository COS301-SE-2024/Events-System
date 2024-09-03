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
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Test Event');

    const descriptionElement = fixture.debugElement.query(By.css('p'));
    expect(descriptionElement.nativeElement.textContent).toContain('This is a test event description.');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/event,');
  });
});