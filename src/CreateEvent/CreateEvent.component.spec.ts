import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CreateEventComponent } from './CreateEvent.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule, GoogleMapsModule, CreateEventComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
            queryParams: of({ startTour: 'true' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct step when step buttons are clicked', () => {
    const stepButtons = fixture.debugElement.queryAll(By.css('.step'));
    stepButtons[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.currentStep).toBe(0);
  });

  // Uncomment and update the following tests as needed
  // it('should display the correct step content based on currentStep', () => {
  //   component.currentStep = 0;
  //   fixture.detectChanges();
  //   let stepContent = fixture.debugElement.query(By.css('div[ngSwitch] div[ngSwitchCase="0"]'));
  //   expect(stepContent).toBeTruthy();

  //   component.currentStep = 1;
  //   fixture.detectChanges();
  //   stepContent = fixture.debugElement.query(By.css('div[ngSwitch] div[ngSwitchCase="1"]'));
  //   expect(stepContent).toBeTruthy();
  // });

  // it('should show tooltip error when name is empty and next button is clicked', () => {
  //   component.currentStep = 0;
  //   fixture.detectChanges();
  //   const nextButton = fixture.debugElement.query(By.css('div[ngSwitchCase="0"] button.btn-success'));
  //   nextButton.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  //   expect(component.isNameEmpty).toBe(true);
  //   const tooltip = fixture.debugElement.query(By.css('div[ngSwitchCase="0"] .tooltip-error'));
  //   expect(tooltip.classes['hidden']).toBe(false);
  // });

  // it('should show tooltip error when description is empty and next button is clicked', () => {
  //   component.currentStep = 1;
  //   fixture.detectChanges();
  //   const nextButton = fixture.debugElement.query(By.css('div[ngSwitchCase="1"] button.btn-success'));
  //   nextButton.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  //   expect(component.isDescriptionEmpty).toBe(true);
  //   const tooltip = fixture.debugElement.query(By.css('div[ngSwitchCase="1"] .tooltip-error'));
  //   expect(tooltip.classes['hidden']).toBe(false);
  // });

  // it('should call goBack when back button is clicked', () => {
  //   spyOn(component, 'goBack');
  //   component.currentStep = 1;
  //   fixture.detectChanges();
  //   const backButton = fixture.debugElement.query(By.css('button[ngSwitchCase="1"]'));
  //   backButton.triggerEventHandler('click', null);
  //   expect(component.goBack).toHaveBeenCalled();
  // });

  // it('should call nextStep when next button is clicked', () => {
  //   spyOn(component, 'nextStep');
  //   component.currentStep = 0;
  //   fixture.detectChanges();
  //   const nextButton = fixture.debugElement.query(By.css('div[ngSwitchCase="0"] button.btn-success'));
  //   nextButton.triggerEventHandler('click', null);
  //   expect(component.nextStep).toHaveBeenCalled();
  // });

  // it('should call nextStep1 when next button is clicked on step 1', () => {
  //   spyOn(component, 'nextStep1');
  //   component.currentStep = 1;
  //   fixture.detectChanges();
  //   const nextButton = fixture.debugElement.query(By.css('div[ngSwitchCase="1"] button.btn-success'));
  //   nextButton.triggerEventHandler('click', null);
  //   expect(component.nextStep1).toHaveBeenCalled();
  // });
});