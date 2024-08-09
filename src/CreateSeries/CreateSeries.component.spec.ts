import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CreateSeriesComponent } from './CreateSeries.component';

// Mock component
@Component({
  selector: 'app-mock-create-series',
  template: '',
})
class MockEventComponent {/*...*/}

@Component({
  template: '<app-mock-create-series></app-mock-create-series>', // Use the correct selector
})
class TestHostComponent {/*...*/}

describe('EventComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSeriesComponent], // Move EventComponent to imports
      declarations: [TestHostComponent, MockEventComponent], // Remove EventComponent from declarations
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }) // Add your own mock values here
          }
        }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});