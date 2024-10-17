import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CreateSeriesComponent } from './CreateSeries.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreateSeriesComponent', () => {
  let component: CreateSeriesComponent;
  let fixture: ComponentFixture<CreateSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule, CreateSeriesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-id' }),
            queryParams: of({ startTour: 'true' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeriesComponent);
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
    expect(component.currentStep).toBe(1);
  });
});